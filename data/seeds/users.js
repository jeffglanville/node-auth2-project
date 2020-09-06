const hashPassword = "$2a$14$qHqCbXUImiBOgXlFNX47wuA7uFWNGNAZutYLvOeye9eotewGlfYV6"
const hashedPassword = "0b0f7abc9efb54c035a32ef2358622f0"

exports.seed = async function(knex) {
  await knex("users").insert([
    {id: 1, username: "jeffglanville", password: hashPassword}
    {id: 2, username: "suzanneglanville", password: hashPassword}
    {id: 3, username: "admin1", password: hashedPassword}
  ])
};
