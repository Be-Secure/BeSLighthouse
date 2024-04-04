#!/bin/bash

start() {
    
    if [ -d "$HOME/.besman" ];then
        beslighthousedatafile="$HOME/.besman/beslighthousedata"
    elif  [ -d "$HOME/.bliman" ];then
        beslighthousedatafile="$HOME/.bliman/beslighthousedata"
    fi

    if [ ! -z $beslighthousedatafile ] && [ -f $beslighthousedatafile ];then
       lightdir=`cat $beslighthousedatafile | grep "BESLIGHTHOUSE_DIR:" | awk '{print $2}'`
       cd $lightdir
       npm start &
    fi
}

stop() {
    pid=`ps ax | grep "npm start" | awk '{print $1}'`
    kill -9 $pid
}

case "$1" in 
    start)
       start
       ;;
    stop)
       stop
       ;;
    restart)
       stop
       start
       ;;
    status)
       # code to check status of app comes here 
       # example: status program_name
       ;;
    *)
       echo "Usage: $0 {start|stop|status|restart}"
esac

exit 0 
