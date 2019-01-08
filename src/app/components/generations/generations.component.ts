import { Component, OnInit } from "@angular/core";
import { DayPrivileges } from "../dayprivileges/dayprivileges/dayprivileges.model";
import { DataService } from "src/app/services/data.service";
import { UserPrivileges } from "../userprivileges/userprivileges.model";
import { stringify } from "@angular/core/src/render3/util";
import { DateFormat } from "../date.format";
import { DateAdapter } from "@angular/material";
@Component({
  selector: "app-generations",
  template: `
    <div class="box">
      <div class="one">
        <div class="inline">
          <button mat-raised-button primary (click)="generate()">Gerar</button>

          <h5 class="inline">Início da geração</h5>
          <input
            [matDatepicker]="pickerini"
            [(ngModel)]="startday"
            placeholder="Data inicial"
          />
          <mat-datepicker-toggle [for]="pickerini"></mat-datepicker-toggle>
          <mat-datepicker #pickerini></mat-datepicker>

          <h5 class="inline">Fim da geração</h5>
          <input
            [matDatepicker]="pickerfim"
            [(ngModel)]="endday"
            placeholder="Data final"
          />
          <mat-datepicker-toggle [for]="pickerfim"></mat-datepicker-toggle>
          <mat-datepicker #pickerfim></mat-datepicker>
          <button mat-raised-button primary (click)="save()">Salvar</button>
        </div>

        <div *ngIf="!hist" class="centerOne">
          <hr *ngIf="totalContador.length > 0" />
          <div *ngFor="let cc of totalContador">
            {{ cc.user }}: {{ cc.count }}
          </div>
          <hr *ngIf="totalContador.length > 0" />
          <div *ngFor="let gen of generation">
            <table>
              <caption style="background: yellow">
                <h5>{{ gen.nameday }} : {{ gen.data | date: "dd-MM-yyyy" }}</h5>
              </caption>
              <thead>
                <tr>
                  <th>Privilégio</th>
                  <th>Varão</th>
                  <th>Tempo total</th>
                  <th>Tempo privilégio</th>
                </tr>
                <thead></thead>
              </thead>

              <tbody>
                <tr *ngFor="let p of gen.priv">
                  <td>
                    <span style="color:blue">{{ p.priviname }}</span>
                  </td>
                  <td>
                    <span>{{ p.user }}</span>
                  </td>
                  <td style="text-align: center">
                    <span *ngIf="p.user"
                      >{{ diffDaysCalc(p.tempototal, gen.data) }}
                    </span>
                  </td>
                  <td style="text-align: center">
                    <span *ngIf="p.user"
                      >{{ diffDaysCalc(p.tempopriv, gen.data) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div *ngIf="hist" class="centerOne">
          <div *ngFor="let cab of myhist">
            <h5>Histórico de geração</h5>
            {{ cab.ini | date: "dd-MM-yyyy" }} até
            {{ cab.fim | date: "dd-MM-yyyy" }}
            <hr />
            <div *ngFor="let cc of totalContador">
              {{ cc.user }}: {{ cc.count }}
            </div>
            <hr />
            <div *ngFor="let gen of cab.generation">
              <table>
                <caption style="background: yellow">
                  <h5>
                    {{ gen.nameday }} : {{ gen.data | date: "dd-MM-yyyy" }}
                  </h5>
                </caption>
                <thead>
                  <tr>
                    <th>Privilégio</th>
                    <th>Varão</th>
                    <th>Tempo total</th>
                    <th>Tempo privilégio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let p of gen.priv">
                    <td>
                      <span style="color:blue">{{ p.priviname }}</span>
                    </td>
                    <td>
                      <span>{{ p.user }}</span>
                    </td>
                    <td style="text-align: center">
                      <span *ngIf="p.user"
                        >{{ diffDaysCalc(p.tempototal, gen.data) }}
                      </span>
                    </td>
                    <td style="text-align: center">
                      <span *ngIf="p.user"
                        >{{ diffDaysCalc(gen.data, p.tempopriv) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="two" *ngIf="histgenerations.length > 0">
        <h5>Histórico</h5>
        <table class="centerOne">
          <tr *ngFor="let gen of histgenerations">
            <td>
              <button mat-stroked-button (click)="exibeHist(gen.ini)">
                {{ gen.ini | date: "ddMMyyyy" }}-{{
                  gen.fim | date: "ddMMyyyy"
                }}
              </button>
            </td>
            <td>
              <button
                mat-raised-button
                primary
                (click)="eraseHist(gen.ini, gen.fim)"
              >
                Apagar
              </button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  `,
  styleUrls: ["./generations.component.css"],
  providers: [{ provide: DateAdapter, useClass: DateFormat }]
})
export class GenerationsComponent implements OnInit {
  dayprivileges: DayPrivileges[] = [];
  userPrivileges: UserPrivileges[] = [];
  histgenerations = [];
  myhist = [];
  hist = false;

  meetingdays: DayPrivileges[] = [];
  userChecked: UserPrivileges[] = [];
  saveAlldateModified: UserPrivileges[] = [];

  startday: Date;
  endday: Date;

  generation = [];
  lastday = [];
  pronto = false;

  totalContador = [];

  DaysEnum = {
    Segunda: 1,
    Terça: 2,
    Quarta: 3,
    Quinta: 4,
    Sexta: 5,
    Sábado: 6,
    Domingo: 0
  };

  contadordevezes = 0;
  constructor(
    private dataService: DataService,
    private dateAdapter: DateAdapter<Date>
  ) {
    dateAdapter.setLocale("en-in");
  }

  ngOnInit() {
    this.dataService.getAllGenerations().then(result => {
      this.histgenerations = result;
      this.histgenerations
        .sort((a, b) => {
          return a.ini.getTime() - b.ini.getTime();
        })
        .reverse();
      console.log(this.histgenerations);
    });

    this.dataService.getAllDayPrivilegesExec().then(result => {
      this.dayprivileges = result as DayPrivileges[];

      this.dayprivileges.sort((a, b) => {
        if (a.rank < b.rank) return -1;
        else return 1;
      });

      this.dayprivileges.sort((a, b) => {
        if (a.nameday < b.nameday) return -1;
        else return 1;
      });

      this.meetingdays = this.dayprivileges.filter(a => a.checked);
    });
  }

  generate() {
    this.userPrivileges = [];
    this.userChecked = [];

    this.dataService.getAllUserPrivilegesExec().then(result => {
      this.userPrivileges = [...(result as UserPrivileges[])];

      this.userChecked = this.userPrivileges.filter(a => a.checked);

      this.userChecked.forEach(a => {
        if (!a.date) a.date = new Date("2017-01-30");
      });


      this.userChecked.sort((a, b) => {
        if (a.nameuser < b.nameuser) return 1;
        if (a.nameuser > b.nameuser) return -1;

        return 0;
      });

      let groupbyName = [];

      let count = 0;
      let name = "";
      this.lastday = [];
      while (count < this.userChecked.length) {
        if (name !== this.userChecked[count].nameuser) {
          groupbyName.push(this.userChecked[count]);

          name = this.userChecked[count].nameuser;
        }
        count++;
      }

      count = 0;
      name = "";
      while (count < groupbyName.length) {
        let user = this.userChecked.filter(
          l => l.nameuser == groupbyName[count].nameuser
        );
        user
          .sort((a, b) => {
            return a.date.getTime() - b.date.getTime();
          })
          .reverse();

        this.lastday.push({
          lastday: new Date(user[0].date),
          user: user[0].nameuser
        });

        count++;
      }

      //efeito shuffle
      for (let i = 0; i < this.lastday.length - 1; i++) {
        let j = i + Math.floor(Math.random() * (this.lastday.length - i));

        let temp = this.lastday[j];
        this.lastday[j] = this.lastday[i];
        this.lastday[i] = temp;
      }

      this.lastday.sort((a, b) => {
        return a.lastday.getTime() - b.lastday.getTime();
      });

      this.hist = false;

      let incialData = new Date("2017-01-30");
      let day = new Date(this.startday);
      let end = new Date(this.endday);
      let currentday: string = "";
      let importantday = [];
      this.generation = [];

      this.meetingdays.map(a => {
        if (currentday !== a.nameday) {
          currentday = a.nameday;
          importantday.push(a.nameday);
        }
      });

      this.pronto = false;

      while (day.getTime() <= end.getTime()) {
        importantday.forEach(a => {
          let fill = [];
          if (day.getDay() == this.DaysEnum[a]) {
            let priv = this.meetingdays.filter(b => b.nameday == a);

            ///preenche os privilegios do dia com usuarios vazios
            priv.forEach(el => {
              fill.push({
                rank: el.rank,
                priviname: el.nameprivilege,
                user: null,
                tempototal: new Date(),
                tempopriv: new Date()
              });
            });

            let countFill = 0;
            let outro = 0;
            let tax = 28;
            let valida = true;

            while (countFill <= fill.length) {
              //procura o usuario com a menor data
              let first = this.lastday[0 + outro];
              let user = this.userChecked.filter(l => l.nameuser == first.user);

              user.sort((a, b) => {
                return a.date.getTime() - b.date.getTime();
              });

              //acha o privilegio no dia para o publicador
              let achei = false;
              for (let h = 0; h < user.length; h++) {
                let userjaexiste = fill.findIndex(u => u.user == first.user);
                if (userjaexiste !== -1) break;

                if (valida) {
                  let restricaoDia = this.diffDaysCalc(user[h].date, day);
                  if (restricaoDia != "Primeira vez")
                    if (restricaoDia < tax) {
                      continue;
                    }
                }

                for (let i = 0; i < fill.length; i++) {
                  if (!fill[i].user && fill[i].rank == user[h].rank) {
                    fill[i].user = user[h].nameuser;
                    /////extra dados
                    fill[i].tempototal = new Date(this.lastday[0].lastday);
                    //////

                    this.userChecked.map(l => {
                      if (
                        l.nameuser == user[h].nameuser &&
                        l.rank == user[h].rank
                      ) {
                        fill[i].tempopriv = new Date(l.date);
                        l.date = new Date(day);
                      }
                    });
                    user[h].date = new Date(day);

                    this.lastday[0].lastday = new Date(day);
                    achei = true;
                    break;
                  }
                }
                if (achei) break;
              }

              if (!achei && outro < this.lastday.length - 1) {
                outro++;
                continue;
              } else if (!achei && outro + 1 == this.lastday.length ) {
                outro = 0;
                tax -= 7;
                //continue;
                if (tax >= 0) continue;
              }

              tax = 28;
              //ordena o publicador com menor data novamente
              this.lastday.sort((a, b) => {
                return a.lastday.getTime() - b.lastday.getTime();
              });

              countFill++;
            }

            this.generation.push({
              nameday: a,
              data: new Date(day),
              priv: [...fill]
            });

            //efeito shuffle

            for (let i = 0; i < this.lastday.length - 1; i++) {
              let j = i + Math.floor(Math.random() * (this.lastday.length - i));

              let temp = this.lastday[j];
              this.lastday[j] = this.lastday[i];
              this.lastday[i] = temp;
            }

            //ordena o publicador com menor data novamente
            this.lastday.sort((a, b) => {
              return a.lastday.getTime() - b.lastday.getTime();
            });
          }
        });

        day.setDate(day.getDate() + 1);
      }

      this.pronto = true;

      this.totalContador = [];

      this.generation.forEach(e => {
        e.priv.forEach(l => {
          let acha = this.totalContador.findIndex(a => l.user == a.user);
          if (acha !== -1) {
            this.totalContador[acha].count++;
          } else if(l.user){
            let oi = {
              user: l.user,
              count: 1
            };
            this.totalContador.push(oi);
          }
        });
      });

      this.saveAlldateModified = [...this.userChecked];
    });
  }

  save() {
    if (this.generation.length > 0) {
      this.dataService
        .addGeneration(this.startday, this.endday, this.generation)
        .then(() => {
          for (let gen of this.saveAlldateModified) {
            this.dataService
              .addUserPrivilege(
                gen.nameuser,
                gen.nameprivilege,
                gen.checked,
                gen.date,
                gen.rank
              )
              .then(result => console.log(result));
          }

          this.dataService.getAllGenerations().then(result => {
            this.histgenerations = [...result];
            this.histgenerations
              .sort((a, b) => {
                return a.ini.getTime() - b.ini.getTime();
              })
              .reverse();
          });
        });
    }
  }

  Setting() {}

  exibeHist(ini) {
    this.myhist = this.histgenerations.filter(a => {
      return a.ini == ini;
    });

    this.totalContador = [];

    this.myhist[0].generation.forEach(e => {
      e.priv.forEach(l => {
        let acha = this.totalContador.findIndex(a => l.user == a.user);
        if (acha !== -1) {
          this.totalContador[acha].count++;
        } else if(l.user){
          let oi = {
            user: l.user,
            count: 1
          };
          this.totalContador.push(oi);
        }
      });
    });
    this.hist = true;
  }

  eraseHist(ini, fim) {
    this.dataService.deleteGeneration(ini, fim).then(() => {
      this.dataService.getAllGenerations().then(result => {
        this.histgenerations = result;
        this.histgenerations
          .sort((a, b) => {
            return a.data.getTime() - b.data.getTime();
          })
          .reverse();
      });
    });
  }

  diffDaysCalc(pdate1: Date, pdate2: Date) {
    let date1 = new Date(pdate1);
    let date2 = new Date(pdate2);
    let timeDiff = Math.abs(date2.getTime() - date1.getTime());
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays > 700) return "Primeira vez";
    return diffDays;
  }
}
