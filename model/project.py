#!/usr/bin/env python
# coding=utf-8
#
# Copyright 2012 F2E.im
# Do have a faith in what you're doing.
# Make your life a story worth telling.

import time
from base import BaseModel

class ProjectModel(BaseModel):
    def __init__(self, db):       
        table_name = "project"
        super(ProjectModel, self).__init__(db,table_name)

    def get_all_project(self, num = 16, current_page = 1):  
        where = 'createTime DESC'    
        return self.get_all_data(num, where, current_page)
    
    def update_project_by_id(self, project_id, project_data):
        where = "id = %s" % project_id
        return self.update_data(self, where, project_data)

    def get_by_project_id(self, project_id):
        where = "id = %s" % project_id 
        field = '*'#"topic.*, \      
        return self.get_a_row(where,field)




