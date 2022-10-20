/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('blogs').del()
  await knex('blogs').insert([
    {
      author: 'John',
      title: 'Johns Blog Title',
      content: 'First Blog',
    },
    {
      author: 'Nick',
      title: 'How to become rich',
      content: 'Riches think differently',
    },
    {
      author: 'Robert',
      title: 'How to retire young',
      content: 'You need to invest, have money to work for you',
    },
  ]);
};
