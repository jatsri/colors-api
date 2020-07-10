const asyncHandler = require('express-async-handler');
const copyFrom = require('pg-copy-streams').from;
const { Readable } = require('stream');

const createEndpoints = ({ app, query, getConnection }) => {
    app.get('/health', (req, res) => {
        res.send('Healthy')
    });

    app.get('/colors', asyncHandler(async (req, res) => {
        const result = await query(`SELECT * FROM colors_hex`);

        res.json({ items: result.rows})
    }));

    app.post('/colors', asyncHandler(async (req, res) => {
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

        insertColors.then(() => {
            res.status(201).send("Colors added");
        });
    }));

    app.delete('/colors/:id', asyncHandler(async (req, res) => {
        const params = req.params;

        const result = await query(`DELETE FROM colors_hex where id = $1`, [ params.id ]);

        if (result.rowCount === 1) {
            res.status(204).send('Deleted');
        }
    }))
}

module.exports = createEndpoints;
