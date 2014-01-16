#!/usr/bin/env python
# coding=utf-8
#
# Copyright 2012 F2E.im
# Do have a faith in what you're doing.
# Make your life a story worth telling.

from wtforms import TextField, HiddenField, validators
from lib.forms import Form

class Project(Form):
    content = TextField('Content', [
        validators.Required(message = "请填写项目描述"),
    ])

    title = TextField('Title', [
        validators.Required(message = "请填写标题"),
        validators.Length(min = 3, message = "帖子标题长度过短（3-56个字符）"),
        validators.Length(max = 56, message = "帖子标题长度过长（3-56个字符）"),
    ])
    area = TextField('Area', [
        validators.Optional(),
    ])
    cost = TextField('Cost', [
        validators.Optional(),
    ])
    category = TextField('Category', [
        validators.Required(message = "请选择分类"),
        validators.Optional(),
    ])
    description = TextField('Description', [
        validators.Optional(),
    ])
    thumb = TextField('Thumb', [
        validators.Optional(),
    ])
    material = TextField('Material', [
        validators.Optional(),
    ])
    hits = TextField('Hits', [
        validators.Optional(),
    ])