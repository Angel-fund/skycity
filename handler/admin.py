#!/usr/bin/env python
# coding=utf-8
#
# Copyright 2012 F2E.im
# Do have a faith in what you're doing.
# Make your life a story worth telling.
import uuid
import hashlib
import Image
import StringIO
import time
import json
import re
import urllib2
import urllib
import tornado.web
import lib.jsonp

from config import Config
from base import *
from lib.sendmail import send
from lib.variables import gen_random
from lib.gravatar import Gravatar
from form.admin import *
from lib.validate_code import create_validate_code

def do_login(self, user_id):
    user_info = self.user_model.get_user_by_uid(user_id)
    user_id = user_info["uid"]
    self.session["uid"] = user_id
    self.session["username"] = user_info["username"]
    self.session["email"] = user_info["email"]
    self.session["password"] = user_info["password"]
    self.session.save()
    self.set_secure_cookie("user", str(user_id))

def do_logout(self):
    # destroy sessions
    self.session["uid"] = None
    self.session["username"] = None
    self.session["email"] = None
    self.session["password"] = None
    self.session.save()

    # destroy cookies
    self.clear_cookie("user")

class IndexHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self,template_variables = {}):      
        user_info = self.get_current_user()
        project_model = self.loader.use("project.model")
        category_model = self.loader.use("category.model")  

        page = int(self.get_argument("p", "1"))
        template_variables["user_info"] = user_info       
        template_variables["project"] = project_model.get_all_project(current_page = page)
        template_variables["category"] = category_model.get_category('project')
        self.render("admin/index.html", **template_variables)

class ProjectEditHandler(BaseHandler): 
    @tornado.web.authenticated
    def get(self, project_id, template_variables = {}): 
        url = self.request.uri
        url = url.split('/')
        print url[len(url)-1]

        # font_type = Config.font_path
        # validate_code_img = '%svalidate.png' % Config.validate_code_path
        # code_img = create_validate_code(size=(180, 45),font_size=30,font_type=font_type,img_type='PNG')
        # code_img[0].save(validate_code_img, "PNG")
        # print code_img[1] 

        project_model = self.loader.use("project.model")        
        category_model = self.loader.use("category.model")        

        template_variables["project"] = project_model.get_by_project_id(project_id)
        template_variables["category"] = category_model.get_category('project')
        self.render("admin/project/edit.html", **template_variables)

    @tornado.web.authenticated
    def post(self, project_id,template_variables = {}):
        project_model = self.loader.use("project.model")
        # validate the fields
        form = Project(self)
        if not form.validate():
            self.get({"errors": form.errors})
            return
        # self.write(form.content.data)
        # self.write(project_id)
        user_info = self.current_user
        template_variables = {
            "content": form.content.data,
            "title": form.title.data,
            "area": form.area.data,
            "cost": form.cost.data,
            "cid": form.category.data,
            "description": form.description.data,
            "thumb": 'http://p.www.xiaomi.com/zt/2013/mi3/detail-bn-950.jpg',
            "material": '砖混结构',
            "userid": user_info["uid"],
            "hits": form.hits.data,
            "createTime": time.strftime('%Y-%m-%d %H:%M:%S')
        }
        # print ', '.join(['%s:%s' % item for item in form.__dict__.items()])
        try:
            update_result = project_model.update_project_by_id(project_id, template_variables)
            template_variables["success_message"] = [u"用户基本资料更新成功"]
        except Exception, e: 
            template_variables["error_message"] = [u"用户基本资料更新失败"]
        
        # updated = self.user_model.set_user_base_info_by_uid(user_info["uid"], {"updated": time.strftime('%Y-%m-%d %H:%M:%S')})
        
        self.get(project_id,template_variables)

class ProjectAddHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self,template_variables = {}):
        category_model = self.loader.use("category.model")  
        if not template_variables:           
            template_variables["project"] = dict(
                        title = '',
                        hits = '',
                        area = '',
                        cost = '',
                        description = '',
                        content = ''
                    ) 
        template_variables["category"] = category_model.get_category('project')

        self.render("admin/project/edit.html", **template_variables)
    
    @tornado.web.authenticated
    def post(self, template_variables = {}):
        project_model = self.loader.use("project.model")
        # validate the fields
        form = Project(self)

        # self.write(form.content.data)
        # self.write(project_id)
        user_info = self.current_user
        template_variables["project"] = {
            "content": form.content.data,
            "title": form.title.data,
            "area": form.area.data,
            "cost": form.cost.data,
            "cid": form.category.data,
            "description": form.description.data,
            "thumb": 'http://p.www.xiaomi.com/zt/2013/mi3/detail-bn-950.jpg',
            "material": '砖混结构',
            "userid": user_info["uid"],
            "hits": form.hits.data,
            "createTime": time.strftime('%Y-%m-%d %H:%M:%S')
        }

        if not form.validate():
            # self.get({"errors": form.errors})
            template_variables["errors"]= form.errors
            print form.errors
            self.get(template_variables)
            return
        # print ', '.join(['%s:%s' % item for item in form.__dict__.items()])
        try:
            update_result = project_model.add_project(template_variables["project"])
            template_variables["success_message"] = [u"项目添加成功"]
        except Exception, e: 
            template_variables["error_message"] = [u"项目添加失败"]
        
        # updated = self.user_model.set_user_base_info_by_uid(user_info["uid"], {"updated": time.strftime('%Y-%m-%d %H:%M:%S')})
        
        self.get(template_variables)

class SettingAvatarHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self, template_variables = {}):     
        user_info = self.get_current_user()
        template_variables["user_info"] = user_info
        template_variables["gen_random"] = gen_random
        self.render("user/setting_avatar.html", **template_variables)

    @tornado.web.authenticated
    def post(self, template_variables = {}):
        template_variables = {}
        if(not "avatar" in self.request.files):
            template_variables["errors"] = {}
            template_variables["errors"]["invalid_avatar"] = [u"请先选择要上传的头像"]
            self.get(template_variables)
            return

        user_info = self.current_user
        user_id = user_info["uid"]
        avatar_name = "%s" % uuid.uuid5(uuid.NAMESPACE_DNS, str(user_id))
        avatar_raw = self.request.files["avatar"][0]["body"]
        avatar_buffer = StringIO.StringIO(avatar_raw)
        avatar = Image.open(avatar_buffer)

        # crop avatar if it's not square
        avatar_w, avatar_h = avatar.size
        avatar_border = avatar_w if avatar_w < avatar_h else avatar_h
        avatar_crop_region = (0, 0, avatar_border, avatar_border)
        avatar = avatar.crop(avatar_crop_region)

        avatar_96x96 = avatar.resize((96, 96), Image.ANTIALIAS)
        avatar_48x48 = avatar.resize((48, 48), Image.ANTIALIAS)
        avatar_32x32 = avatar.resize((32, 32), Image.ANTIALIAS)
        avatar_96x96.save("./static/avatar/b_%s.png" % avatar_name, "PNG")
        avatar_48x48.save("./static/avatar/m_%s.png" % avatar_name, "PNG")
        avatar_32x32.save("./static/avatar/s_%s.png" % avatar_name, "PNG")
        result = self.user_model.set_user_avatar_by_uid(user_id, "%s.png" % avatar_name)
        template_variables["success_message"] = [u"用户头像更新成功"]
        # update `updated`
        updated = self.user_model.set_user_base_info_by_uid(user_id, {"updated": time.strftime('%Y-%m-%d %H:%M:%S')})
        self.get(template_variables)

class SettingAvatarFromGravatarHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self, template_variables = {}):        
        user_info = self.current_user
        user_id = user_info["uid"]
        avatar_name = "%s" % uuid.uuid5(uuid.NAMESPACE_DNS, str(user_id))
        gravatar = Gravatar(user_info["email"])
        avatar_96x96 = gravatar.get_image(size = 96, filetype_extension = False)
        avatar_48x48 = gravatar.get_image(size = 48, filetype_extension = False)
        avatar_32x32 = gravatar.get_image(size = 32, filetype_extension = False)
        urllib.urlretrieve(avatar_96x96, "./static/avatar/b_%s.png" % avatar_name)
        urllib.urlretrieve(avatar_48x48, "./static/avatar/m_%s.png" % avatar_name)
        urllib.urlretrieve(avatar_32x32, "./static/avatar/s_%s.png" % avatar_name)
        result = self.user_model.set_user_avatar_by_uid(user_id, "%s.png" % avatar_name)

        template_variables["success_message"] = [u"用户头像更新成功"]
        # update `updated`
        updated = self.user_model.set_user_base_info_by_uid(user_id, {"updated": time.strftime('%Y-%m-%d %H:%M:%S')})
        template_variables["user_info"] = user_info
        template_variables["gen_random"] = gen_random
        self.render("user/setting_avatar.html", **template_variables)

class SettingPasswordHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self, template_variables = {}):
        user_info = self.get_current_user()
        self.render("user/setting_password.html", **template_variables)

    @tornado.web.authenticated
    def post(self, template_variables = {}):
        template_variables = {}

        # validate the fields

        form = SettingPasswordForm(self)

        if not form.validate():
            self.get({"errors": form.errors})
            return

        # validate the password

        user_info = self.current_user
        user_id = user_info["uid"]
        secure_password = hashlib.sha1(form.password_old.data).hexdigest()
        secure_new_password = hashlib.sha1(form.password.data).hexdigest()

        if(not user_info["password"] == secure_password):
            template_variables["errors"] = {}
            template_variables["errors"]["error_password"] = [u"当前密码输入有误"]
            self.get(template_variables)
            return

        # continue while validate succeed

        update_result = self.user_model.set_user_password_by_uid(user_id, secure_new_password)
        template_variables["success_message"] = [u"您的用户密码已更新"]
        # update `updated`
        updated = self.user_model.set_user_base_info_by_uid(user_id, {"updated": time.strftime('%Y-%m-%d %H:%M:%S')})
        self.get(template_variables)

class ForgotPasswordHandler(BaseHandler):
    def get(self, template_variables = {}):
        do_logout(self)
        self.render("user/forgot_password.html", **template_variables)

    def post(self, template_variables = {}):
        template_variables = {}

        # validate the fields

        form = ForgotPasswordForm(self)

        if not form.validate():
            self.get({"errors": form.errors})
            return


        # validate the post value

        user_info = self.user_model.get_user_by_email_and_username(form.email.data, form.username.data)

        if(not user_info):
            template_variables["errors"] = {}
            template_variables["errors"]["invalid_email_or_username"] = [u"所填用户名和邮箱有误"]
            self.get(template_variables)
            return

        # continue while validate succeed
        # update password

        new_password = uuid.uuid1().hex
        new_secure_password = hashlib.sha1(new_password).hexdigest()
        update_result = self.user_model.set_user_password_by_uid(user_info["uid"], new_secure_password)

        # send password reset link to user

        mail_title = u"前端社区（F2E.im）找回密码"
        template_variables = {"email": form.email.data, "new_password": new_password};
        template_variables["success_message"] = [u"新密码已发送至您的注册邮箱"]
        mail_content = self.render_string("user/forgot_password_mail.html", **template_variables)
        send(mail_title, mail_content, form.email.data)

        self.get(template_variables)

class LoginHandler(BaseHandler):
    def get(self, template_variables = {}):
        do_logout(self)
        self.render("user/login.html", **template_variables)

    def post(self, template_variables = {}):
        template_variables = {}

        # validate the fields

        form = LoginForm(self)

        if not form.validate():
            self.get({"errors": form.errors})
            return

        # continue while validate succeed
        
        secure_password = hashlib.sha1(form.password.data).hexdigest()
        secure_password_md5 = hashlib.md5(form.password.data).hexdigest()
        user_info = self.user_model.get_user_by_email_and_password(form.email.data, secure_password)
        user_info = user_info or self.user_model.get_user_by_email_and_password(form.email.data, secure_password_md5)
        
        if(user_info):
            do_login(self, user_info["uid"])
            # update `last_login`
            updated = self.user_model.set_user_base_info_by_uid(user_info["uid"], {"last_login": time.strftime('%Y-%m-%d %H:%M:%S')})
            self.redirect(self.get_argument("next", "/"))
            return

        template_variables["errors"] = {"invalid_email_or_password": [u"邮箱或者密码不正确"]}
        self.get(template_variables)

class LogoutHandler(BaseHandler):
    def get(self):
        do_logout(self)
        # redirect
        self.redirect(self.get_argument("next", "/"))

class RegisterHandler(BaseHandler):
    def get(self, template_variables = {}):
        do_logout(self)
        self.render("user/register.html", **template_variables)

    def post(self, template_variables = {}):
        template_variables = {}

        # validate the fields

        form = RegisterForm(self)

        if not form.validate():
            self.get({"errors": form.errors})
            return

        # validate duplicated

        duplicated_email = self.user_model.get_user_by_email(form.email.data)
        duplicated_username = self.user_model.get_user_by_username(form.username.data)

        if(duplicated_email or duplicated_username):
            template_variables["errors"] = {}

            if(duplicated_email):
                template_variables["errors"]["duplicated_email"] = [u"所填邮箱已经被注册过"]

            if(duplicated_username):
                template_variables["errors"]["duplicated_username"] = [u"所填用户名已经被注册过"]

            self.get(template_variables)
            return

        # validate reserved

        if(form.username.data in self.settings.get("reserved")):
            template_variables["errors"] = {}
            template_variables["errors"]["reserved_username"] = [u"用户名被保留不可用"]
            self.get(template_variables)
            return

        # continue while validate succeed

        secure_password = hashlib.sha1(form.password.data).hexdigest()

        user_info = {
            "email": form.email.data,
            "password": secure_password,
            "username": form.username.data,
            "created": time.strftime('%Y-%m-%d %H:%M:%S')
        }

        if(self.current_user):
            return
        
        user_id = self.user_model.add_new_user(user_info)
        
        if(user_id):
            do_login(self, user_id)

            # send register success mail to user

            mail_title = u"前端社区（F2E.im）注册成功通知"
            mail_content = self.render_string("user/register_mail.html")
            send(mail_title, mail_content, form.email.data)

        self.redirect(self.get_argument("next", "/"))

