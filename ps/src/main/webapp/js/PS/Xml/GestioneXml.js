var NS_NODE = {

    createNodeWithAttr: function (name, params) {

        return NS_NODE.createNode(name, null, params);
    },
    createNodeWithText: function (name, text) {
        return NS_NODE.createNode(name, text, null);
    },
    createSimpleNode: function (name) {
        return NS_NODE.createNode(name, null, null)
    },

    createNode: function (name, text, params) {
        //params  = {key:value, key:value, ..., key:value}
        var node = document.createElement(name.toUpperCase());
        if (text != null) {
            node.innerText = text;
        }

        if (params != null) {
            //params  = {key:value, key:value}
            for (var i in params) {
                try {
                    node.setAttribute(i, params[i])
                }catch(e) {
                    alert("Attezione Errore nella creazione dell' xml!");
                    logger.error(e);
                    return '<xml><err>Errore</err></xml>' ;
                }
            }
        }
        return node;
    }
};

function serializeXmlNode(xmlNode) {

    if (typeof window.XMLSerializer != "undefined") {
        //IE 9 > , mozzilla, chrome
        return '<?xml version="1.0" encoding="ISO-8859-1"?>' + xmlNode.innerHTML.toUpperCase().toString();
    } else {
        return $(xmlNode).html().toUpperCase();

    }
}