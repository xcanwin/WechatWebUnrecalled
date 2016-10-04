    static function OnBeforeResponse(oSession: Session) {
        if (m_Hide304s && oSession.responseCode == 304) {
            oSession["ui-hide"] = "true";
        }
        if(oSession.GetResponseBodyAsString().Contains('"MsgType": 10002')){
            if(oSession.GetResponseBodyAsString().Contains('&lt;replacemsg&gt;&lt;\!\[CDATA\[')){
                oSession.utilDecodeResponse();
                var responseStr = System.Text.Encoding.UTF8.GetString(oSession.responseBodyBytes);
                var responseNew = responseStr.replace('"MsgType": 10002', '"MsgType": 10000');
                var userNameRe = /&lt;replacemsg&gt;&lt;\!\[CDATA\[(.*)撤回了一条消息\]\]&gt;&lt;\/replacemsg&gt;/;
                var userName = userNameRe.exec(responseNew)[1];
                var contentRe = /"Content": "(.*)"/gi;
                var contentNew = '"Content": "[XX防撤销]：' + userName + '尝试撤回上一条消息（已阻止）"';
                var responseNew = responseNew.replace(contentRe, contentNew);
                oSession.utilSetResponseBody(responseNew);
            }
        }
    }