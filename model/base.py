#!/usr/bin/env python
# coding=utf-8
#
# Copyright 2012 F2E.im
# Do have a faith in what you're doing.
# Make your life a story worth telling.

import time
from lib.query import Query

class BaseModel(Query):
    def __init__(self, db,table_name):
        self.db = db
        self.table_name = table_name
        super(BaseModel, self).__init__()

    def get_all_data(self, num = 16, where = 1,current_page = 1,join = None):
        join = None#"LEFT JOIN user AS author_user ON topic.author_id = author_user.uid \
                #LEFT JOIN node ON topic.node_id = node.id \
                #LEFT JOIN user AS last_replied_user ON topic.last_replied_by = last_replied_user.uid"
        order = where#'createTime ASC'#"last_touched DESC, created DESC, last_replied_time DESC, id DESC"
        field = '*'#"topic.*, \
                # author_user.username as author_username, \
                # author_user.nickname as author_nickname, \
                # author_user.avatar as author_avatar, \
                # author_user.uid as author_uid, \
                # author_user.reputation as author_reputation, \
                # node.name as node_name, \
                # node.slug as node_slug, \
                # last_replied_user.username as last_replied_username, \
                # last_replied_user.nickname as last_replied_nickname" .join(join)
        return self.order(order).join(join).field(field).pages(current_page = current_page, list_rows = num)

    def get_a_row(self,where,field = '*'):
        return self.where(where).field(field).find()

    def update_data(self, where, option):        
        return self.where(where).data(options).save()
