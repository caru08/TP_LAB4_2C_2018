import { Component, Input, ContentChild, Output, TemplateRef, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { TableColumn } from "../../../models/TableColumn";


@Component({
  selector: 'crud-table',
  templateUrl: 'crud-table.component.html',
  styleUrls:['crud-table.component.scss']
})

export class CrudTableComponent implements OnInit, OnChanges {

  @Input ()title:string;
  @Input ()columns:TableColumn[];
  @Input ('filter-value')filterValue:any;
  @Input ('filter-column')filterColumn:string;
  @Input ('top-header')topHeader?:TableColumn[];
  @Input ()collection:any;
  @ContentChild(TemplateRef) itemTemplate: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns:string[] = new Array<string>();
  public dataSource: MatTableDataSource<any>;

  constructor(){
  }

  ngOnInit(){
    this.setDataSource();
    this.setDisplayedColumns();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['collection'] && changes['collection'].currentValue) {
        this.setDataSource();
    }
    if(changes['filterValue'] && changes['filterValue'].currentValue) {
      if(!this.dataSource){
        return;
      }else{
        this.filterData();
      }
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0
    });
    console.log('afterviewinit de crudtable');
  }

  private setDisplayedColumns(){
    for(var i=0; i< this.columns.length; i++){
      this.displayedColumns.push(this.columns[i].name);
    }
  }

  private setDataSource(){
    this.dataSource = new MatTableDataSource(this.collection);
    this.filterData();
    this.paginator.pageIndex = 0;
  }

  private filterData(){
    if(this.filterColumn){
      let column = this.filterColumn;
      this.dataSource.filterPredicate = (data, filter): boolean => {
        return data[column].toString().indexOf(filter) != -1;
      }
    }
    this.dataSource.filter = this.filterValue ? this.filterValue.toString(): "";
  }

}


