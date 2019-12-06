/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

logger.info("api.authorization.getListFromResultset --> {\"username\":\""+username+"\"}");

if("sined".equals(username) && "sined".equals(password)){
    isAllowed = true;
    logger.info("Access allowed");
}else{
    isAllowed = false;
    logger.info("Access denied");
}


