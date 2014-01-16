#!/usr/bin/env python
# coding=utf-8
#
# Copyright 2012 F2E.im
# Do have a faith in what you're doing.
# Make your life a story worth telling.

import time
from base import BaseModel

class CategoryModel(BaseModel):
    def __init__(self, db):       
        table_name = "category"
        super(CategoryModel, self).__init__(db,table_name)

    def get_category(self,category):        
        where = {'type' : category}
        return self.get_all(where)






