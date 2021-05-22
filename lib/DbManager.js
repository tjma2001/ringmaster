const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sql');

function asyncGet(query) {
  return new Promise((resolve, reject) => {
    db.get(query, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

function handler(resolve, reject) {
  return function (error, results) {
    if (error) {
      console.log('db error', error);
      reject(error);
      return;
    }
    resolve(results);
  };
}

class DbManager {
  constructor() {
    db.serialize(() => {
      db.run("CREATE TABLE IF NOT EXISTS ring (name TEXT UNIQUE, id INTEGER PRIMARY KEY AUTOINCREMENT)");
      db.run(`
        CREATE TABLE IF NOT EXISTS 
          node (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT, 
            address TEXT, 
            ringId INTEGER,
            UNIQUE (address, ringId),
            FOREIGN KEY (ringId)
            REFERENCES ring (id)
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        )`);
    });
  }

  addNodeToRing({ name, address, ringId }) {
    return new Promise(async (resolve, reject) => {
      const _handler = handler(resolve, reject);
      const result = await asyncGet(`SELECT * FROM ring where id = ${ringId}`);
      console.log('result', result);
      if (result) {
        db.run(`INSERT INTO node (name, address, ringId) values ("${name}", "${address}", ${Number(ringId)})`, _handler);
      } else {
        reject('not found');
      }
    });
  }

  createRing(params) {
    return new Promise((resolve, reject) => {
      db.run(`INSERT into ring (name) values ("${params.name}")`, handler(resolve, reject));
    });
  }

  deleteRing(id) {
    return new Promise((resolve, reject) => {
      db.run(`DELETE from node where ringId = ${id}`, (error, _result) => {
        if (error) {
          console.log('could not delete nodes', error);
          reject(error);
        } else {
          db.run(`DELETE from ring where id = ${id}`, handler(resolve, reject));
        }
      });
    });
  }

  deleteNode(id) {
    return new Promise((resolve, reject) => {
      db.run(`DELETE from node where id = ${id}`, handler(resolve, reject));
    });
  }

  getNode(nodeId) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * from node where id = ${nodeId}`, handler(resolve, reject));
    });
  }

  getNodesFromRing(id) {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * from node where ringId = ${id}`, handler(resolve, reject));
    });
  }

  getRing(id) {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * from ring where id = ${id}`, (error, results) => {
        if (error) {
          console.log('Failure to get ring', error);
          reject(error);
        } else if (results.length === 0) {
          resolve(false);
        } else {
          db.all(`SELECT * from node`, handler(resolve, reject));
        }
      });
    });
  }

  getRings() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * from ring`, handler(resolve, reject));
    });
  }



  getRingById(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * from ring where id = "${id}"`, handler(resolve, reject));
    });
  }

  updateRing(id, name) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * from ring where id = ${id}`, (error, result) => {
        if (!result) {
          resolve(false);
          return;
        }
        db.run(`UPDATE ring set name = "${name}" where id = ${id}`, handler(resolve, reject));
      });
    });
  }
}

module.exports = DbManager;
