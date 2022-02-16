module.exports = (sequelize, DataTypes) => {
    const Table = sequelize.define('Table', {
        id_join: DataTypes.INTEGER,
        table_name: DataTypes.STRING,
        insertion_date: DataTypes.DATE
    })

    return Table
}