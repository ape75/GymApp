import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'gymapp.db' }); //Open database - create if the database does not exist
var tableName="extypes";
var tableName2="exdone";
//method returns a Promise - in the calling side .then(...).then(...)....catch(...) can be used
export const init=()=>{
    const promise=new Promise((resolve, reject)=>{
        db.transaction((tx)=>{
            tx.executeSql('DROP TABLE IF EXISTS extypes', []);
            tx.executeSql('DROP TABLE IF EXISTS exdone', []); 
            //By default, primary key is auto_incremented - we do not add anything to that column
            tx.executeSql('create table if not exists '+tableName+'(id integer not null primary key, name text not null, exgroup text not null);',
            [],//second parameters of execution:empty square brackets - this parameter is not needed when creating table
            //If the transaction succeeds, this is called
            ()=>{
                resolve();//There is no need to return anything
            },
            //If the transaction fails, this is called
            (_,err)=>{
                reject(err);
            }
            );
            
            /* tx.executeSql('insert into ' +tableName+ ' (id, name, exgroup) values (?,?,?)', [1, 'Hauiskääntö käsipainoilla', 'Hauis']);
            tx.executeSql('insert into ' +tableName+ ' (id, name, exgroup) values (?,?,?)', [2, 'Jalkaprässi', 'Pakarat']);
            tx.executeSql('insert into ' +tableName+ ' (id, name, exgroup) values (?,?,?)', [3, 'Leuanveto', 'Selkälihas, epäkäs, hauis']);
            tx.executeSql('insert into ' +tableName+ ' (id, name, exgroup) values (?,?,?)', [4, 'Ristikkäistalja', 'Rintalihakset']);
            tx.executeSql('insert into ' +tableName+ ' (id, name, exgroup) values (?,?,?)', [5, 'Vatsarutistukset', 'Suorat vatsalihakset']); */

            tx.executeSql('insert into ' +tableName+ ' (id, name, exgroup) values (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?)', 
            [   1, 'Hauiskääntö käsipainoilla', 'Hauis' ,
                2, 'Jalkaprässi', 'Pakarat', 
                3, 'Leuanveto', 'Selkälihas, epäkäs, hauis',
                4, 'Ristikkäistalja', 'Rintalihakset',
                5, 'Vatsarutistukset', 'Suorat vatsalihakset',
                6, 'Alatalja', 'Leveä selkälihas , epäkäs, hauis',
                7, 'Dippi', 'Rinta, ojentajat, etuolkapäät',
                8, 'Kyykky', 'Pakarat, etureidet',
                9, 'Maastaveto', 'Suorat selkälihakset, pakarat, etureidet',
                10, 'Pohjeprässi seisten', 'Pohje- ja kaksoiskantalihas',
                11, 'Polven ojennus laitteessa', 'Etureidet',
                12, 'Pään yli ojennus taljassa', 'Ojentajat',
                13, 'Ristiveto maaten taljassa', 'Takaolkapäät',
                14, 'Penkkipunnerrus levytangolla', 'Rinta, ojentajat, etuolkapäät',
                15, 'Kulmasoutu', 'Leveä selkälihas, epäkäs, hauis',
            ]);

            
            tx.executeSql('create table if not exists '+tableName2+
            '(id integer not null primary key, date text not null, reps integer not null, sets integer not null, typeid integer not null, FOREIGN KEY(typeid) REFERENCES extypes(id));',
            [],
            ()=>{
                resolve();
            },(_,err)=>{
                reject(err);
            }
            );

            /* tx.executeSql('insert into ' +tableName2+ ' (id, date, reps, sets, typeid) values (?,?,?,?,?)', [1, '2022-10-08', 20, 5, 2]);
            tx.executeSql('insert into ' +tableName2+ ' (id, date, reps, sets, typeid) values (?,?,?,?,?)', [2, '2022-10-08', 10, 10, 5]);
            tx.executeSql('insert into ' +tableName2+ ' (id, date, reps, sets, typeid) values (?,?,?,?,?)', [3, '2022-10-07', 20, 15, 4]);
            tx.executeSql('insert into ' +tableName2+ ' (id, date, reps, sets, typeid) values (?,?,?,?,?)', [4, '2022-10-07', 30, 20, 1]); */

            tx.executeSql('insert into ' +tableName2+ ' (id, date, reps, sets, typeid) values (?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?)', 
            [   1, '2022/10/08', 20, 5, 2,
                2, '2022/10/08', 10, 10, 5,
                3, '2022/10/07', 20, 15, 4,
                4, '2022/10/07', 30, 20, 1,
                5, '2022/10/06', 25, 12, 10,
                6, '2022/10/06', 5, 5, 9,
                7, '2022/10/06', 17, 5, 6,
                8, '2022/10/05', 22, 10, 7,
                9, '2022/10/04', 33, 1, 5,
                10, '2022/10/04', 5, 5, 8,
                11, '2022/10/06', 7, 8, 3,
                12, '2022/10/06', 14, 8, 7,
                13, '2022/10/06', 10, 10, 15,
            ]);

        });
             
    });
    return promise;
};

export const fetchAllExDone=()=>{
    const promise=new Promise((resolve, reject)=>{
        db.transaction((tx)=>{            
            tx.executeSql('select exdone.id, exdone.date, extypes.name, extypes.exgroup, exdone.reps, exdone.sets from exdone inner join extypes on extypes.id = exdone.typeid' , [],
                (tx, result)=>{
                    let items=[];//Create a new empty Javascript array
                    //And add all the items of the result (database rows/records) into that table
                    for (let i = 0; i < result.rows.length; i++){
                        items.push(result.rows.item(i));                       
                    }                   
                    resolve(items);//The data the Promise will have when returned
                },
                (tx,err)=>{
                    console.log("Err");
                    console.log(err);
                    reject(err);
                }
            );
        });
    });
    return promise;
};

export const fetchExByDay=(day)=>{
    const promise=new Promise((resolve, reject)=>{
        db.transaction((tx)=>{            
            tx.executeSql('select exdone.id, exdone.date, extypes.name, extypes.exgroup, exdone.reps, exdone.sets from exdone inner join extypes on extypes.id = exdone.typeid where exdone.date like ?' ,
             [day],
                (tx, result)=>{
                    let items=[];//Create a new empty Javascript array
                    //And add all the items of the result (database rows/records) into that table
                    for (let i = 0; i < result.rows.length; i++){
                        items.push(result.rows.item(i));                       
                    }                   
                    resolve(items);//The data the Promise will have when returned
                },
                (tx,err)=>{
                    console.log("Err");
                    console.log(err);
                    reject(err);
                }
            );
        });
    });
    return promise;
};

