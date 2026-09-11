import pymysql


def get_connection():

    connection = pymysql.connect(
        host="localhost",
        user="root",
        password="root",
        database="restaurantdb",
        charset="utf8",
        cursorclass=pymysql.cursors.DictCursor
    )

    return connection