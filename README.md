----
====
##天空之城
	天空之城后端基于python 的tornado 高性能框架开发，
	前端css框架基于Bootstrap v3 ；js组件基于 seajs 模块化加载

天空之城-关注于私人建筑，景观设计与交易社区


## How to contribute

Fork and send pull request.

## 使用

1. install all required modules:

    ```
    shell> pip install -r requirements.txt
    ```

2. create database and then execute sql file in dbstructure/

    ```
    shell> mysql -u YOURUSERNAME -p

    mysql> create database f2e;
    mysql> exit

    shell> mysql -u YOURUSERNAME -p --database=f2e < dbstructure/f2e.sql
    ```

3. set your mysql user/password and smtp server config in `application.py` and `lib/sendmail.py`.
4. check above, using ``python application.py`` to start server.

    ```
    shell> python application.py --port=9001 --mysql_database=f2e --mysql_host=localhost --mysql_password=YOURPASSWORD --mysql_user=YOURUSERNAME
    ```

## How to set up a production enironment

You need to know a little of supervisor and nginx, all config files are available in conf/
