
export class TableColumn {
  name: string;
  label:string;
  sort:boolean;
  align:string;
  size:string;
  limitLabelTo:number;

  constructor(name, label, sort, align, size, limitLabelTo?){
    this.name = name;
    this.label = label;
    this.sort = sort;
    this.align = align;
    this.size = size;
    this.limitLabelTo = limitLabelTo;
  }
}
