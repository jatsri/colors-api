const copyFrom = require('pg-copy-streams').from;
const { Readable } = require('stream');

module.exports = async ({ getConnection }, req, res) => {
    const body = req.body;
    console.log('From the post request', body);

    const client = await getConnection();
    const done = () => {
        client.release();
    }

    const createTSV = (rs, colors) => {
        return () => {
            const items = colors.items;
            let currentIndex = 0;

            const createLine = (currentIndex) => {
                const currentItem = items[currentIndex];
                if(currentItem) {
                    rs.push(currentItem.color + '\t' + currentItem.hex + '\n');
                } else {
                    return rs.push(null)
                }

                currentIndex++;
                createLine(currentIndex);
            };
            createLine(currentIndex);
        }
    }

    const insertColors = new Promise((resolve, reject) => {
        const stream = client.query(
            copyFrom(`
                    COPY colors_hex (color, hex) FROM STDIN
                `)
        );

        const rs = new Readable();
        rs._read = createTSV(rs, body);

        const onError = (error) => {
            console.log('Error inserting colors:', error);
            done();
            reject(error);
        }

        stream.on('error', onError);
        rs.on('error', onError);
        stream.on('finish', () => {
            console.log('Colors inserted');
            done();
            resolve();
        });

        rs.pipe(stream);

    });

    insertColors
        .then(() => {
            res.status(201).send();
        })
        .catch((err) => {
            const UNIQUE_CONSTRAINT_VIOLATION_CODE = '23505';
            if(err.code === UNIQUE_CONSTRAINT_VIOLATION_CODE) {
                res.status(409).send();
            }
        })
};
