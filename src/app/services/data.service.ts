import { Injectable } from "@angular/core";

import { nSQL } from "nano-sql";


@Injectable({
  providedIn: "root"
})
export class DataService {
  initialized = false;
  dbdays = "days";
  dbusers = "users";
  dbprivileges = "privileges";
  dbdayprivileges = "dayprivileges";
  dbuserprivileges = "userprivileges";
  dbgenerations = "generations";
  dbexceptions = "exceptions";
  dbuserexceptions = "userexceptions";

  constructor() {
    if (!this.initialized) {


      nSQL("generations")
      .model([{ key: "chave", type: "string", props: ["pk"] },
      { key: "ini", type: "date"},
      { key: "fim", type: "date"},
      {key:'generation',type:'array'},])
      .config({
        mode: "PERM",
        history: true
      });


      nSQL("days")
        .model([{ key: "name", type: "string", props: ["pk"] }])
        .config({
          mode: "PERM",
          history: true
        });

      nSQL("users")
        .model([{ key: "name", type: "string", props: ["pk"] }])
        .config({
          mode: "PERM",
          history: true
        });

      nSQL("privileges")
        .model([
          { key: "rank", type: "string", props: ["pk"] },
          { key: "name", type: "string"}])
        .config({
          mode: "PERM",
          history: true
        });

        nSQL("exceptions")
        .model([
          { key: "name", type: "string", props: ["pk"] }])
        .config({
          mode: "PERM",
          history: true
        });

        nSQL("dayprivileges")
        .model([
          { key: "namedayprivileges", type: "string",  props: ["pk"] },
          { key: "nameday", type: "string"},
          { key: "rank", type: "string"},
          { key: "nameprivilege", type: "string"},
          { key: "checked", type: "boolean"}])
        .config({
          mode: "PERM",
          history: true
        });

        nSQL("userprivileges")
        .model([
          { key: "nameuserprivileges", type: "string", props: ["pk"] },
          { key: "nameuser", type: "string"},
          { key: "rank", type: "string",},
          { key: "nameprivilege", type: "string"},
          { key: "checked", type: "boolean"},
          { key: "date", type: "date"}
        ])
        .config({
          mode: "PERM",
          history: true
        });

        nSQL("userexceptions")
        .model([
          { key: "nameuserexceptions", type: "string", props: ["pk"] },
          { key: "nameuser", type: "string"},
          { key: "nameexception", type: "string"},
          { key: "checked", type: "boolean"},
          { key: "date", type: "date"}
        ])
        .config({
          mode: "PERM",
          history: true
        });

      nSQL()
        .connect()
        .then(result => {
          this.initialized = true;
        });

    }
  }

//////////////////////////////////////////////Days
getAllDaysExec() {
 return nSQL(this.dbdays)
      .query("select")
      .exec()

}

  getAllDays() {
    return nSQL(this.dbdays).observable(() =>
      nSQL(this.dbdays)
        .query("select")
        .emit()
    );
  }

  addDay(dayName: string) {
    return nSQL(this.dbdays)
      .query("upsert", { name: dayName })
      .exec();
  }

  deleteDay(dayName: string) {
    return nSQL(this.dbdays)
      .query("delete")
      .where(["name", "=", dayName])
      .exec();
  }
/////////////////////////////////////////////Users
getAllUsersExec() {
  return nSQL(this.dbusers)
       .query("select")
       .exec()

 }

  getAllUsers() {
    return nSQL(this.dbusers).observable(() =>
      nSQL(this.dbusers)
        .query("select")
        .emit()
    );
  }

  addUser(name: string) {
    return nSQL(this.dbusers)
      .query("upsert", { name: name })
      .exec();
  }

  deleteUser(name: string) {
    return nSQL(this.dbusers)
      .query("delete")
      .where(["name", "=", name])
      .exec().then((r=>{

        nSQL(this.dbuserprivileges)
        .query("delete")
        .where(["nameuser", "=", name])
        .exec();

        nSQL(this.dbuserexceptions)
        .query("delete")
        .where(["nameuser", "=", name])
        .exec();

      }))


  }
/////////////////////////////////////Privileges
getAllPrivilegesExec() {

    return nSQL(this.dbprivileges)
      .query("select")
      .exec()

}

getAllPrivileges() {
  return nSQL(this.dbprivileges).observable(() =>
    nSQL(this.dbprivileges)
      .query("select")
      .emit()
  );
}

addPrivilege(rank: string, name: string) {
  return nSQL(this.dbprivileges)
    .query("upsert", { rank: rank, name: name })
    .exec();
}

deletePrivilege(rank: string) {
  return nSQL(this.dbprivileges)
    .query("delete")
    .where(["rank", "=", rank])
    .exec().then((r=>{

      nSQL(this.dbuserprivileges)
      .query("delete")
      .where(["rank", "=", rank])
      .exec();

      nSQL(this.dbdayprivileges)
      .query("delete")
      .where(["rank", "=", rank])
      .exec();

    }))
}

/////////////////////////////////////////////////
getAllExceptionsExec() {

  return nSQL(this.dbexceptions)
    .query("select")
    .exec()

}

getAllExceptions() {
return nSQL(this.dbexceptions).observable(() =>
  nSQL(this.dbexceptions)
    .query("select")
    .emit()
);
}

addException(name: string) {
return nSQL(this.dbexceptions)
  .query("upsert", { name: name })
  .exec();
}

deleteException(name: string) {
return nSQL(this.dbexceptions)
  .query("delete")
  .where(["name", "=", name])
  .exec().then((r=>{

    nSQL(this.dbuserexceptions)
    .query("delete")
    .where(["nameexception", "=", name])
    .exec();


  }))
}


/////////////////////////////////////////////////
addDayPrivilege(day: string, rank: string, privilege: string, checked: boolean) {
  return nSQL(this.dbdayprivileges)
    .query("upsert", { namedayprivileges: day + privilege + rank, nameday: day, rank: rank, nameprivilege: privilege, checked: checked  })
    .exec();
}

getAllDayPrivilegesExec() {

  return nSQL(this.dbdayprivileges)
    .query("select")
    .exec()

}
////////////////////////////////////////////////////////
addUserException(username: string, exceptionname: string, checked: boolean, date: Date) {

  return nSQL(this.dbuserexceptions)
    .query("upsert", { nameuserexceptions: username + exceptionname, nameuser: username, nameexception: exceptionname, checked: checked, date: date})
    .exec();
}



getAllUserExceptionsExec() {

  return nSQL(this.dbuserexceptions)
    .query("select")
    .exec()

}

/////////////////////////////////////////////////////////////
addUserPrivilege(username: string, privilegename: string, checked: boolean, date: Date, rank: string) {

  return nSQL(this.dbuserprivileges)
    .query("upsert", { nameuserprivileges: username + privilegename + rank, nameuser: username, nameprivilege: privilegename, checked: checked, date: date, rank: rank })
    .exec();
}



getAllUserPrivilegesExec() {

  return nSQL(this.dbuserprivileges)
    .query("select")
    .exec()

}
////////////////////////////////////////////////
getAllGenerations() {

  return nSQL(this.dbgenerations)
    .query("select")
    .exec()

}

addGeneration(ini: Date, fim: Date, generation: any) {
  console.log(generation)
  let chave = ini.getDate().toString() + ini.getMonth().toString() + ini.getFullYear().toString() + fim.getDate().toString() + fim.getMonth().toString() + fim.getFullYear().toString();
  return nSQL(this.dbgenerations)
    .query("upsert", { chave: chave, ini: ini, fim: fim, generation: generation })
    .exec();
}


deleteGeneration(ini: Date, fim: Date) {
  let chave = ini.getDate().toString() + ini.getMonth().toString() + ini.getFullYear().toString() + fim.getDate().toString() + fim.getMonth().toString() + fim.getFullYear().toString();
  console.log(chave)
  return nSQL(this.dbgenerations)
    .query("delete")
    .where(["chave", "=", chave])
    .exec();
}

deleteAll(){

  nSQL(this.dbgenerations).query("drop").exec()
  nSQL(this.dbdays).query("drop").exec()
  nSQL(this.dbusers).query("drop").exec()
  nSQL(this.dbprivileges).query("drop").exec()
  nSQL(this.dbdayprivileges).query("drop").exec()
  nSQL(this.dbuserprivileges).query("drop").exec()
  nSQL(this.dbexceptions).query("drop").exec()
  nSQL(this.dbuserexceptions).query("drop").exec()

}

}
