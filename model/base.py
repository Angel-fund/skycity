#!/usr/bin/env python
# coding=utf-8
#
# Copyright 2012 F2E.im
# Do have a faith in what you're doing.
# Make your life a story worth telling.
import types 
import time
from lib.query import Query

class BaseModel(Query):
    def __init__(self, db,table_name):
        self.db = db
        self.table_name = table_name
        super(BaseModel, self).__init__()

    def _where(self,where):
        if type(where) is types.DictType: 
            whereList =[]
            for (k,v) in  where.items():                
                whereList.append("%s='%s'" % (k,v))
            whereStr =  ' AND '.join(whereList) 
        else:        
            whereStr = where
        return whereStr

    def _field(self,field):
        if type(field) is types.ListType: 
            fieldStr =  ', '.join(field) 
        else:        
            fieldStr = field
        return fieldStr    

    def get_all_data(self, num , where=1, order=None, current_page=1,join=None, field="*" ):
        whereStr = self._where(where)
        fieldStr = self._field(field)    
        return self.where(whereStr).order(order).join(join).field(field).pages(current_page = current_page, list_rows = num)

    def get_a_row(self,where,field = '*'):
        whereStr = self._where(where)
        fieldStr = self._field(field)
        return self.where(whereStr).field(field).find()

    def update_data(self, where, options): 
        whereStr = self._where(where)       
        return self.where(whereStr).data(options).save()

    def add_data(self, data):
       return self.data(data).add()

    def get_all(self,where):        
        # where = {'type' : "project"}
        whereStr = self._where(where)        
        return self.where(whereStr).select()
