npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npx sequelize-cli db:create --env=test
npx sequelize-cli db:migrate --env=test