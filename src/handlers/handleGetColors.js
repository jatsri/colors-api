module.exports = async ({ query }, req, res) => {
    const result = await query(`SELECT * FROM colors_hex`);

    res.json({ items: result.rows});
};
