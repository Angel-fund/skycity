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
        where = 1
        order = 'createTime DESC' 
        join = 'LEFT JOIN category AS c ON c.id = project.cid'
        field = ['project.content','project.createTime','project.hits','project.id','project.title','c.name']
        return self.get_all_data(num, where, order, current_page,join,field)
    
    def update_project_by_id(self, project_id, project_data):
        where = {'id': project_id}
        return self.update_data(where, project_data)

    def get_by_project_id(self, project_id):
        where = {'id': project_id}
        field = '*'
        return self.get_a_row(where,field)

    def add_project(self, project_info):
        return self.add_data(project_info)





