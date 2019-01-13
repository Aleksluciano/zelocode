import { UserExceptions } from "./../userexceptions/userexceptions.model";
import { Component, OnInit } from "@angular/core";
import { DayPrivileges } from "../dayprivileges/dayprivileges.model";
import { DataService } from "src/app/services/data.service";
import { UserPrivileges } from "../userprivileges/userprivileges.model";
import { stringify } from "@angular/core/src/render3/util";
import { DateFormat } from "../date.format";
import { DateAdapter } from "@angular/material";
import { toUnicode } from "punycode";
@Component({
  selector: "app-generations",
  template: `
    <div class="box">
      <div class="one">
        <div class="inline">
          <button mat-raised-button primary (click)="generate(true)">
            Gerar
          </button>

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

        <br />
        <br />
        <div *ngIf="!pronto">
          <mat-spinner ></mat-spinner>
        </div>
        <div *ngIf="!hist" class="centerOne">
          <div
            *ngIf="this.totalContador.length > 0 && !hist && !detalhe"
            (click)="inverteDetalhe()"
          >
            <a class="myClickableThingy">Detalhe (+)</a>
          </div>
          <div
            *ngIf="this.totalContador.length > 0 && !hist && detalhe"
            (click)="inverteDetalhe()"
          >
            <a class="myClickableThingy">Detalhe (-)</a>
          </div>
          <table *ngFor="let cc of totalContador">
            <thead>
              <tr>
                <th style="background-color:lightgreen; width:450px">
                  <span
                    ><strong>{{ cc.user }}</strong></span
                  >
                </th>
                <th>{{ cc.count }}</th>
              </tr>
            </thead>
            <tbody *ngIf="detalhe">
              <tr *ngFor="let prow of privGeral">
                <td>{{ prow }}</td>
                <td>{{ cc[prow] }}</td>
              </tr>
            </tbody>
          </table>

          <div *ngFor="let gen of generation">
            <table>
              <caption style="background: yellow; width:557px">
                <h5>{{ gen.nameday }} : {{ gen.data | date: "dd-MM-yyyy" }}</h5>
              </caption>
              <thead>
                <tr>
                  <th>Privilégio</th>
                  <th style="width:250px">Varão</th>
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
            <div
              *ngIf="this.totalContador.length > 0 && hist && !detalhe"
              (click)="inverteDetalhe()"
            >
              <a class="myClickableThingy">Detalhe (+)</a>
            </div>
            <div
              *ngIf="this.totalContador.length > 0 && hist && detalhe"
              (click)="inverteDetalhe()"
            >
              <a class="myClickableThingy">Detalhe (-)</a>
            </div>
            <table *ngFor="let cc of totalContador">
              <thead>
                <tr>
                  <th style="background-color:lightgreen; width:450px">
                    <span
                      ><strong>{{ cc.user }}</strong></span
                    >
                  </th>
                  <th>{{ cc.count }}</th>
                </tr>
              </thead>
              <tbody *ngIf="detalhe">
                <tr *ngFor="let prow of privGeral">
                  <td>{{ prow }}</td>
                  <td>{{ cc[prow] }}</td>
                </tr>
              </tbody>
            </table>

            <div *ngFor="let gen of cab.generation">
              <table>
                <caption style="background: yellow; width:557px">
                  <h5>
                    {{ gen.nameday }} : {{ gen.data | date: "dd-MM-yyyy" }}
                  </h5>
                </caption>
                <thead>
                  <tr>
                    <th>Privilégio</th>
                    <th style="width:250px">Varão</th>
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
  userExceptions: UserExceptions[] = [];

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
  pronto = true;

  totalContador = [];
  privGeral = [];
  menor = 1000;
  menorPriv = 1000;
  maior = 0;
  maiorPriv = 0;
  detalhe = false;
  verificador = 0;
  constant = 0;
  maiorDoMaior = 0;
  maiorDoMaiorPriv = 0;
  menorDoMaiorPriv = 0;
  menorDoMaior = 0;

  paraProcesso = true;

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
    });

    this.dataService.getAllUserExceptionsExec().then(result => {
      this.userExceptions = result as UserExceptions[];
    });

    this.dataService.getAllDayPrivilegesExec().then(result => {
      this.dayprivileges = result as DayPrivileges[];

      this.dayprivileges.sort((a, b) => {
        if (a.nameprivilege < b.nameprivilege) return -1;
        else return 1;
      });

      this.dayprivileges.sort((a, b) => {
        if (a.nameday < b.nameday) return -1;
        else return 1;
      });

      this.meetingdays = [...this.dayprivileges.filter(a => a.checked)];
    });
  }

  generate(manual) {
    this.pronto = false;
    let jaexiste = false;
    this.verificador = 0;
    this.histgenerations.forEach(a => {
      if (
        this.startday.getTime() <= a.fim.getTime() ||
        this.endday.getTime() <= a.fim.getTime() ||
        this.startday.getTime() > this.endday.getTime()
      ) {
        jaexiste = true;
      }
    });

    if (jaexiste) {
      alert("Período incorreto ou já gerado!");
      return;
    }

    if (manual) {
      this.paraProcesso = true;

      this.verificador = 0;
      this.maior = 0;
      this.maiorPriv = 0;

      this.constant = 0;
      this.maiorDoMaior = 0;
      this.menorDoMaior = 1000;

      this.maiorDoMaiorPriv = 0;
      this.menorDoMaiorPriv = 1000;
    }

    this.detalhe = false;

    this.dataService.getAllUserPrivilegesExec().then(result => {
      while (this.paraProcesso) {
        this.userPrivileges = [];
        this.userChecked = [];

        let tudo = result as UserPrivileges[];

        tudo.map(x => {
          let g = {
            nameuserprivileges: x.nameuserprivileges,
            nameuser: x.nameuser,
            rank: x.rank,
            nameprivilege: x.nameprivilege,
            checked: x.checked,
            date: new Date(x.date)
          };

          this.userPrivileges.push(g);
        });

        this.userChecked = [...this.userPrivileges.filter(a => a.checked)];

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
          let user = [
            ...this.userChecked.filter(
              l => l.nameuser == groupbyName[count].nameuser
            )
          ];

          user
            .sort((a, b) => {
              return a.date.getTime() - b.date.getTime();
            })
            .reverse();

          this.lastday.push({
            lastday: new Date(user[0].date),
            privultirank: user[0].rank,
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

        //this.pronto = false;

        while (day.getTime() <= end.getTime()) {
          importantday.forEach(a => {
            let fill = [];
            if (day.getDay() == this.DaysEnum[a]) {
              let priv = [...this.meetingdays.filter(b => b.nameday == a)];

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
              let tax = 90;
              let valida = true;

              while (countFill <= fill.length) {
                //procura o usuario com a menor data
                let first = this.lastday[0 + outro];
                let user = [
                  ...this.userChecked.filter(l => l.nameuser == first.user)
                ];

                user.sort((a, b) => {
                  return a.date.getTime() - b.date.getTime();
                });

                //acha o privilegio no dia para o publicador
                let achei = false;
                for (let h = 0; h < user.length; h++) {
                  let userjaexiste = fill.findIndex(u => u.user == first.user);
                  if (userjaexiste !== -1) break;
                  let userexcept = this.userExceptions.find(j => {
                    if (j.nameuser == first.user && j.checked && j.date) {
                      if (j.date.getTime() == day.getTime()) return true;
                    }
                  });
                  if (userexcept) break;
                  // let userexcept = this.userExceptions.findIndex(j => {
                  //   console.log(j.nameuser, j.date)

                  //   if(j.nameuser == first.user && j.checked && j.date){
                  //     console.log('hehe')
                  //    if( j.date.getTime() == day.getTime()) return true;
                  //   }

                  //   })
                  //  console.log(userexcept)
                  // if (userexcept !== -1) break;

                  let restricaoDia = this.diffDaysCalc(user[h].date, day);
                  let restricaototal = this.diffDaysCalc(
                    this.lastday[0 + outro].lastday,
                    day
                  );
                  if (restricaototal != "Primeira vez") {
                    if (outro > 0) {
                      //impede que dias muito proximos os irmaos sejam designados
                      if (restricaoDia < tax || restricaototal < tax) {
                        continue;
                      }

                      if (restricaototal == restricaoDia && tax >= 0) continue;
                    }

                    //impede que dias muito proximos os irmaos sejam designados, mas deixa que irmãos
                    //com designações prioritarias, ou seja, só eles tem essa designação sejam designados
                    if (restricaototal == restricaoDia && tax >= 0) continue;
                  }

                  for (let i = 0; i < fill.length; i++) {
                    if (!fill[i].user && fill[i].rank == user[h].rank) {
                      fill[i].user = user[h].nameuser;
                      fill[i].tempototal = new Date(
                        this.lastday[0 + outro].lastday
                      );

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

                      this.lastday[0 + outro].lastday = new Date(day);
                      achei = true;
                      break;
                    }
                  }
                  if (achei) break;
                }

                if (!achei && outro < this.lastday.length - 1) {
                  outro++;
                  continue;
                } else if (!achei && outro + 1 == this.lastday.length) {
                  outro = 0;
                  tax -= 3;
                  //continue;
                  if (tax > -90) continue;
                }

                tax = 90;
                outro = 0;
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
                let j =
                  i + Math.floor(Math.random() * (this.lastday.length - i));

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



        this.totalContador = [];

        let monta = [];
        // this.dayprivileges.forEach(a=>{
        //   monta.push(a.nameprivilege)
        // });

        this.totalContador = [];

        this.generation.forEach(e => {
          e.priv.forEach(l => {
            monta.push(l.priviname);
            let acha = this.totalContador.findIndex(a => l.user == a.user);
            if (acha !== -1) {
              this.totalContador[acha].count++;
              if (this.totalContador[acha][l.priviname]) {
                this.totalContador[acha][l.priviname]++;
              } else {
                let obj = { ...this.totalContador[acha] };
                let pair = { [l.priviname]: 1 };
                this.totalContador[acha] = { ...obj, ...pair };
              }
            } else if (l.user) {
              let oi = {
                user: l.user,
                count: 1,
                [l.priviname]: 1
              };
              this.totalContador.push(oi);
            }
          });
        });

        //deleta duplicados
        this.privGeral = [];
        this.privGeral = Array.from(new Set(monta));

        if (this.paraProcesso) {
          this.menor = 1000;
          this.menorPriv = 1000;
          this.maiorDoMaior = 0;
          this.maiorDoMaiorPriv = 0;
          this.totalContador.forEach(k => {
            if (this.maiorDoMaior < k.count) this.maiorDoMaior = k.count;

            if (this.menor > k.count && k.count != 0) this.menor = k.count;

            if (this.menorPriv > k[Object.keys(k)[2]] && k[Object.keys(k)[2]] != 0) this.menorPriv = k[Object.keys(k)[2]];

            if (this.maiorDoMaiorPriv < k[Object.keys(k)[2]]){
              this.maiorDoMaiorPriv = k[Object.keys(k)[2]]


            }
          });

          let x = false, y =false, z=false;

          //menor do maior privilegio
          if (this.menorDoMaiorPriv > this.maiorDoMaiorPriv){
          this.menorDoMaiorPriv = this.maiorDoMaiorPriv;
          }

           //menor do maior designacoes
          if (this.menorDoMaior > this.maiorDoMaior){
            this.menorDoMaior = this.maiorDoMaior;
          }

          if (this.maior < this.menor){
            this.maior = this.menor;
          }

          // if (this.maiorPriv < this.menorPriv) {
          //   this.maiorPriv = this.menorPriv;
          // }

          this.verificador++;
          if (this.verificador > 400) {
           // console.log("media menor ", this.menorDoMaior,this.maiorDoMaior)
           // console.log("priv menor ", this.menorDoMaiorPriv,this.maiorDoMaiorPriv)
            if (
              this.menor == this.maior &&
              //this.menorDoMaior == this.maiorDoMaior &&
              ( this.menorDoMaiorPriv + this.constant >= this.maiorDoMaiorPriv) &&
              this.verificador > 401

            ) {

              this.paraProcesso = false;
            }
            //console.log(this.verificador,this.verificador % 1000, this.constant)
            if(this.verificador % 1000 == 0)this.constant++;
          }
        }
      }

      this.saveAlldateModified = [];
      this.saveAlldateModified = [...this.userChecked];
      this.pronto = true;
    });
  }

  save() {
    if (this.generation.length > 0) {
      this.dataService
        .addGeneration(this.startday, this.endday, this.generation)
        .then(() => {
          for (let gen of this.saveAlldateModified) {
            this.dataService.addUserPrivilege(
              gen.nameuser,
              gen.nameprivilege,
              gen.checked,
              gen.date,
              gen.rank
            );
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

  inverteDetalhe() {
    this.detalhe = !this.detalhe;
  }

  Setting() {}

  exibeHist(ini) {
    this.detalhe = false;
    this.myhist = this.histgenerations.filter(a => {
      return a.ini.getTime() == ini.getTime();
    });

    this.totalContador = [];
    let monta = [];

    this.myhist[0].generation.forEach(e => {
      e.priv.forEach(l => {
        monta.push(l.priviname);
        let acha = this.totalContador.findIndex(a => l.user == a.user);
        if (acha !== -1) {
          this.totalContador[acha].count++;
          if (this.totalContador[acha][l.priviname]) {
            this.totalContador[acha][l.priviname]++;
          } else {
            let obj = { ...this.totalContador[acha] };
            let pair = { [l.priviname]: 1 };
            this.totalContador[acha] = { ...obj, ...pair };
          }
        } else if (l.user) {
          let oi = {
            user: l.user,
            count: 1,
            [l.priviname]: 1
          };
          this.totalContador.push(oi);
        }
      });
    });

    this.privGeral = [];
    this.privGeral = Array.from(new Set(monta));
    this.totalContador.sort((a,b)=> {
    if (a.user < b.user) return -1;
    else return 1;
  })
    this.hist = true;
  }

  eraseHist(ini, fim) {

    if(this.histgenerations.length == 1){
      for (let gen of this.histgenerations[0].generation) {
        for (let priv of gen.priv) {
          console.log(gen.data)
        this.dataService.addUserPrivilege(
          priv.user,
          priv.priviname,
          true,
          null,
          priv.rank
        );
      }
    }
  }





    this.dataService.deleteGeneration(ini, fim).then(() => {
      this.dataService.getAllGenerations().then(result => {
        this.histgenerations = result;
        this.histgenerations
          .sort((a, b) => {
            return a.ini.getTime() - b.ini.getTime();
          })
          .reverse();

          if(this.histgenerations.length > 0){
          for (let gen of this.histgenerations[0].generation) {
            for (let priv of gen.priv) {
              console.log(gen.data)
            this.dataService.addUserPrivilege(
              priv.user,
              priv.priviname,
              true,
              gen.data,
              priv.rank
            );
          }
        }
      }





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
