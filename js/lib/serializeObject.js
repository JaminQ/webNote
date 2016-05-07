$.fn.extend({
	/**
	 返回Object对象，key是每个表单元素的name，value是值，相同name元素的值会被覆盖，最后的有效<br/>
	 基于serializeArray转换：http://www.w3school.com.cn/jquery/ajax_serializearray.asp

	 @class serializeObject
	 @namespace $.fn
	 @example
	 	req("common/serializeObject");
	  	$('form').serializeObject();
	  	$('input').serializeObject();

	 */
    serializeObject : function(){

    	var arr = this.serializeArray(), obj = {};
    	$(arr).each(function(i, item) {
    		obj[item.name] = typeof item.value === "string" ? item.value.replace(/\u00A0/ig, " ") : item.value;
    	});

    	return obj;
    }
});