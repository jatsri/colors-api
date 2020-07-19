module.exports = async ({ query }, req, res) => {
    const params = req.params;

    const result = await query(`DELETE FROM colors_hex where id = $1`, [ params.id ]);

    if (result.rowCount === 1) {
        return res.status(204).send('Deleted');
    }

    res.status(404).send();
}
