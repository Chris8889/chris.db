# chris.db

A small and fast package for json and mongodb databases.

# Install Package

To Install this package, type the following into your project's terminal:

`npm install chris.db`

# MongoDB Usage

```js
const {MongoDB} = require(`chris.db`);
const db = new MongoDB(`MongoDB Database URI`, `Your Collection Name`);

// To update or set your data
await db.set(`example`, `test`); // -> test

// To get your data
await db.get(`example`); // -> test

// To delete your data
await db.delete(`example`); // -> true

// To increase your data
await db.add(`example`, 2); // -> 2

// To decrase your data
await db.subtract(`example`, 1); // -> 1

// To learn database has the data
await db.has(`example`); // -> true

// To push the data
await db.push(`example`, `test`); // -> `test`

// To pull the data
await db.pull(`example`, `test`); // -> []

// To get all data
await db.all();

// To delete all data
await db.clear();

// To create a collection
await db.createCollection(`collection name`);

// To delete collection you've connected
await db.dropCollection();

// To get database's uptime
db.uptime();

// To change your schema name;
db.updateSchema(`new schema name`);

// To create a schema;
db.createSchema(`schema name`);
```

# JSON Usage

```js
const {Database} = require(`chris.db`);
const db = new Database(); // If you want you specify where the data should be stored; new Database(`myDatas`);

// To update or set your data;
db.set(`example`, `test`); // -> test

// To get your data;
db.get(`example`); // -> test

// To delete your data;
db.delete(`example`); // -> true

// To increase your data;
db.add(`example`, 2); // -> 2

// To decrase your data;
db.subtract(`example`, 1); // -> 1

// To learn database has the data;
db.has(`example`); // -> true

// To push the data;
db.push(`example`, `test`); // -> `test`

// To pull the data;
db.pull(`example`, `test`); // -> []

// To get all data;
db.all();

// To delete all data;
db.clear();

// To get database's ping;
db.ping();
```

# Need Help? Join Our Discord Server!

https://discord.gg/4j8s8gnV7A