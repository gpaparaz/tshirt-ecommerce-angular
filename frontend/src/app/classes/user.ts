export interface UserInterface {
   id : number;
   name : string;
   email : string;
   credit : number;
   address : string;
   province : string;
   municipality : string;
   state : string;
   prefix :  string;
   telephone : number;
   zipCode : number;
}

export class User implements UserInterface {
  id : number;
   name : string;
   email : string;
   credit : number;
   address : string;
   province : string;
   municipality : string;
   state : string;
   prefix :  string;
   telephone : number;
   zipCode : number;
   constructor(id : number, name : string, email : string, credit : number, address : string, province : string, municipality : string, state : string, prefix : string, telephone : number, zipCode: number) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.credit = credit;
    this.address = address;
    this.province = province;
    this.municipality = municipality;
    this.state = state;
    this.prefix = prefix;
    this.telephone = telephone;
    this.zipCode = zipCode;
   }
}
