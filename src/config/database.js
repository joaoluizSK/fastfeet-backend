module.exports = {
  dialect: 'postgres', // dialeto utilizado para conversar com o db
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'fastfeet', // nome da database
  define: {
    timestamps: true, // permite usar timestamps
    underscored: true, // Cria o nome dos atributos da tabela usando underscode pattern ao inves de camelCase Ex: user_name
    underscoredAll: true, // Cria o nome das tabelas usando o underscore patter Ex: user_group
  },
};
