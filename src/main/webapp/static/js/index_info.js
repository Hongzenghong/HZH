//全局变量 总记录数,当做最后一页
var totalRecord;
var currentPage;
/**
 * 程序入口
 * 
 * @returns
 */
$(function() {
	to_page(1);

});
// =====================辅助功能(开始)===========================
/**
 * 查询所有部门信息 ele 部门信息添加到哪个元素
 * 
 * @returns
 */
function getDepts(ele) {
	$(ele).empty();
	$.ajax({
		url : "http://10.10.72.145:8080/ssm/depts",
		async : false,
		type : "get",
		success : function(result) {
			// console.log(result)
			// 遍历集合对象 添加到 select 元素中
			$.each(result.extend.depts, function() {
				var optionEle = $("<option></option>").append(this.name).attr(
						"value", this.id);
				optionEle.appendTo(ele);
			});
			// alert("dept");
		}
	});
}

// =====================辅助功能(结束)===========================

// =====================首页加载(开始)===========================
/**
 * 跳转到页数面
 * 
 * @param pn
 *            页码
 * @returns
 */
function to_page(pn) {
	$.ajax({
		url : "http://10.10.72.145:8080/ssm/emps",
		data : "pn=" + pn,
		type : "GET",
		success : function(result) {
			// console.log(result);
			// 解析员工信息
			build_emps_table(result);
			// 解析分页信息
			build_page_info(result);
			// 解析显示分页条数据
			build_page_nav(result);
		}
	});
}

/**
 * 解析员工信息,并包装成表格
 * 
 * @param result
 *            json数据
 * @returns
 */
function build_emps_table(result) {
	// 每次调用之前都要清空table的一下数据
	$("#emps_table tbody").empty();

	var emps = result.extend.pageInfo.list;
	$
			.each(
					emps,
					function(index, item) {
						// alert(item.lastName);
						// 遍历出每一列的对象
						var checkBoxTd = $("<td><input type='checkbox' class='check_item'/></td>")
						var idTd = $("<td></td>").append(item.id);
						var lastNameTd = $("<td></td>").append(item.lastName);
						var emailTd = $("<td></td>").append(item.email);
						var genderTd = $("<td></td>").append(
								item.gender == 1 ? '男' : '女');
						var ageTd = $("<td></td>").append(item.age);
						var departmentTd = $("<td></td>").append(
								item.department.name);

						var editBtn = $("<button></button>").addClass(
								"btn btn-primary btn-sm edit_btn").append(
								$("<span></span>").addClass(
										"glyphicon glyphicon-pencil").attr(
										"aria-hidden", "true")).append(" ")
								.append("编辑");
						// 为编辑按钮添加一个自定义属性,来表示当前员工的id
						editBtn.attr("edit-id", item.id);

						var delBtn = $("<button></button>").addClass(
								"btn btn-danger btn-sm delete_btn").append(
								$("<span></span>").addClass(
										"glyphicon glyphicon-trash").attr(
										"aria-hidden", "true")).append(" ")
								.append("删除");
						// 为删除按钮添加一个自定义属性,来表示当前员工的id
						delBtn.attr("del-id", item.id);

						var btnTd = $("<td></td>").append(editBtn).append(" ")
								.append(delBtn);
						// 添加到表格中
						$("<tr></tr>").append(checkBoxTd).append(idTd).append(
								lastNameTd).append(emailTd).append(genderTd)
								.append(ageTd).append(departmentTd).append(
										btnTd).appendTo("#emps_table tbody");
					});
}
// 解析分页信息
function build_page_info(result) {
	// 清空原有的内容
	$("#page_info_area").empty();
	// 添加分页具体数据
	$("#page_info_area").append(
			"当前第" + result.extend.pageInfo.pageNum + " 页,  " + "总共"
					+ result.extend.pageInfo.pages + "页, 总共"
					+ result.extend.pageInfo.total + "条记录");
	totalRecord = result.extend.pageInfo.total;
	currentPage = result.extend.pageInfo.pageNum;
}
/**
 * 解析分页条信息
 * 
 * @param result
 *            json数据
 * @returns
 */
function build_page_nav(result) {
	// 清空原有的内容
	$("#page_nav_area").empty();

	var ul = $("<ul></ul>").addClass("pagination");
	// 首页li 前一页li
	var firstPageLi = $("<li></li>").append(
			$("<a></a>").append("首页").attr("href", "#"));
	var prePageLi = $("<li></li>").append($("<a></a>").append("&laquo;"));
	// 后一页和尾页
	var lastPageLi = $("<li></li>").append(
			$("<a></a>").append("末页").attr("href", "#"));
	var nextPageLi = $("<li></li>").append($("<a></a>").append("&raquo;"));

	// 判断是否存在前一页,没有就不能够点击 不能用!
	if (!result.extend.pageInfo.hasPreviousPage) {
		firstPageLi.addClass("disabled");
		prePageLi.addClass("disabled");
	} else {
		// 为元素绑定单击事件
		firstPageLi.click(function() {
			to_page(1);
		});
		prePageLi.click(function() {
			to_page(result.extend.pageInfo.pageNum - 1);
		});
	}
	// 判断是否存在后一页,没有就将后一页跟尾页关闭
	if (!result.extend.pageInfo.hasNextPage) {
		lastPageLi.addClass("disabled");
		nextPageLi.addClass("disabled");
	} else {
		// 为元素绑定单击事件
		nextPageLi.click(function() {
			to_page(result.extend.pageInfo.pageNum + 1);
		});
		lastPageLi.click(function() {
			to_page(result.extend.pageInfo.pages);
		});
	}

	// 添加到ul标签中
	ul.append(firstPageLi).append(prePageLi);

	// 遍历出 1 2 3 4 添加页码
	$.each(result.extend.pageInfo.navigatepageNums, function(index, item) {
		// item 就是遍历后的对象
		var numLi = $("<li></li>").append($("<a></a>").append(item));
		// 判断是否是当前页,是就添加激活状态
		if (result.extend.pageInfo.pageNum == item) {
			numLi.addClass("active");
		}
		// 为每一页都绑定事件
		numLi.click(function() {
			to_page(item);
		});
		// 将每一个页数都添加进去
		ul.append(numLi);
	});
	// 添加进ul
	ul.append(nextPageLi).append(lastPageLi);
	// 导航标签
	var navEle = $("<nav></nav>").append(ul);
	navEle.appendTo("#page_nav_area");
}
// =====================首页加载(结束)===========================

// =====================添加员工(开始)===========================
/**
 * 点击添加 添加员工的准备
 * 
 * @returns
 */
$("#emp_add_model_btn").click(function() {
	// 清楚模态框表单数据
	// $("#empAddModal form")[0] jq对象转换为document对象
	// 表单的document对象调用reset方法重置表单
	// reset_form 表单全部重置的方法 3
	reset_form("#empAddModal form");
	// 清楚表单 2
	getDepts("#empAddModal select");
	// 弹出模态框 1
	$("#empAddModal").modal({
		backdrop : "static"
	});
});
/**
 * 表单重置
 * 
 * @param ele
 *            元素(选择器)
 * @returns
 */
function reset_form(ele) {
	// 表单内容情况
	$(ele)[0].reset();
	// 表单样式清空 find("") 查询子节点
	$(ele).find("*").removeClass("has-error has-success");
	// 表单提示内容清除 span 的内容
	$(ele).find(".help-block").text("");
}

/**
 * 用户名是否可用
 * 
 * @returns
 */
$("#emp_add_lastName").change(
		function() {
			var lastName = this.value;
			$.ajax({
				url : "http://10.10.72.145:8080/ssm/checkuser",
				type : "POST",
				data : "lastName=" + lastName,
				success : function(result) {
					if (result.code == 100) {
						show_vilidate_msg("#emp_add_lastName", "success",
								"用户名可用");
						$("#emp_save_btn").attr("ajax_va", "success");
					} else {
						show_vilidate_msg("#emp_add_lastName", "error",
								result.extend.va_msg);
						$("#emp_save_btn").attr("ajax_va", "error");
					}
				}
			});
		});

/**
 * 点击保存 保存员工
 * 
 * @returns
 */
$("#emp_save_btn").click(function() {
	// 表单判断 2
	if (!validate_add_form()) {
		return false;
	}
	// 判断用户名是否存在 3 这里是用到change函数 判断用户名是否存在 存在设置 ajax-va 为 success 失败为 error
	if ($("#emp_save_btn").attr("ajax_va") == "error") {
		return false;
	}
	// ajax 请求添加员工 1
	$.ajax({
		url : "http://10.10.72.145:8080/ssm/emp",
		type : "post",
		data : $("#empAddModal form").serialize(),
		success : function(result) {
			if (result.code == 100) {
				// 员工保存成功
				// alert(result.msg);
				$("#empAddModal").modal('hide');
				// 来到最后一页显示添加数据
				// 发送ajax请求,显示最后一页
				// 因为pageHeader总会把大于页码数的请求,显示为最后一个页码返回数据
				// totalRecord 总记录数
				to_page(totalRecord);
			} else {
				// 显示失败信息
				console.log(result);
			}
		}
	});
});

/**
 * 校验表单数据
 * 
 * @returns false 终止表单提交
 */
function validate_add_form() {
	// 1.拿到表单数据,使用正则表达式
	// 注意: 添加样式,需要清楚之前的样式
	// 用户名
	var lastName = $("#emp_add_lastName").val();
	var regName = /(^[a-zA-Z0-9_-]{6,16}$)|(^[\u2E80-\u9FFF]{2,5})/;
	if (!regName.test(lastName)) {
		// alert("用户可以是2-5位中文或者6-16为英文和数字的结合");
		// $("#emp_add_lastName").parent().addClass("has-error");
		// $("#emp_add_lastName").next("span").text("用户可以是2-5位中文或者6-16为英文和数字的结合")
		// show_vilidate_msg 显示校验结果的提示信息
		show_vilidate_msg("#emp_add_lastName", "error",
				"用户可以是2-5位中文或者6-16为英文和数字的结合");
		return false;
	} else {
		// $("#emp_add_lastName").parent().addClass("has-success");
		// $("#emp_add_lastName").next("span").text("");
		show_vilidate_msg("#emp_add_lastName", "success", "");
	}
	// email 邮箱格式不正确
	var email = $("#emp_add_email").val();
	var regEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
	if (!regEmail.test(email)) {
		show_vilidate_msg("#emp_add_email", "error", "邮箱格式不正确");
		return false;
	} else {
		show_vilidate_msg("#emp_add_email", "success", "");
	}
	// 年龄 年龄必须是整数
	var age = $("#emp_add_age").val();
	var regAge = /^[0-9]+$/;
	if (!regAge.test(age)) {
		show_vilidate_msg("#emp_add_age", "error", "年龄必须是整数");
		return false;
	} else {
		show_vilidate_msg("#emp_add_age", "success", "");
	}

	return true;
}
/**
 * 显示校验结果的提示信息
 * 
 * @param ele
 *            元素(选择器)
 * @param status
 *            状态 值:error success
 * @param msg
 *            提示信息
 */
function show_vilidate_msg(ele, status, msg) {
	// 由于静态页面,反正样式覆盖使效果出现差异,移除样式
	$(ele).parent().removeClass("has-error as-success");

	// status 状态
	if ("error" == status) {
		$(ele).parent().addClass("has-error");
		$(ele).next("span").text(msg)
	} else if ("success" == status) {
		$(ele).parent().addClass("has-success");
		$(ele).next("span").text(msg);
	}
}

// =====================添加员工(结束)===========================

// =====================员工编辑(开始)===========================
// 1.我们时按钮创建执勤就绑定了click,所以绑定不上
// 1).可以在创建按钮的时候绑定,但耦合度太高了
// 2).可以用live(),高版本已经被删除了
// 3).可以用on()进行替代
$(document).on("click", ".edit_btn", function() {
	// alert("edit");
	// 1.显示模态框
	// 1.1 显示部门信息
	getEmp($(this).attr("edit-id"));
	getDepts("#empUpdateModal select");
	// 1.2 显示出员工信息
	// 弹出模态框 1
	// 2把员工的id传递到更新按钮中
	$("#emp_update_btn").attr("edit-id", $(this).attr("edit-id"));
	$("#empUpdateModal").modal({
		backdrop : "static"
	});
});

/**
 * 根据员工id 查询员工信息并赋值到修改模态框中
 * 
 * @param id
 * @returns
 */

function getEmp(id) {
	$.ajax({
		url : "http://10.10.72.145:8080/ssm/emp/" + id,
		type : "get",
		success : function(result) {
			// alert(result);
			console.log(result.extend.emp);
			var empData = result.extend.emp;
			$("#emp_update_lastName").text(empData.lastName);
			$("#emp_update_email").val(empData.email);
			$("#emp_update_age").val(empData.age);
			$("#empUpdateModal input[name=gender]").val([ empData.gender ]);
			$("#empUpdateModal select").val([ empData.dId ]);
			// alert("emp");
		}
	});
}

$("#emp_update_btn").click(function() {
	// email 邮箱格式不正确
	var email = $("#emp_update_email").val();
	var regEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
	if (!regEmail.test(email)) {
		show_vilidate_msg("#emp_update_email", "error", "邮箱格式不正确");
		return false;
	} else {
		show_vilidate_msg("#emp_update_email", "success", "");
	}
	// 年龄 年龄必须是整数
	var age = $("#emp_update_age").val();
	var regAge = /^[0-9]+$/;
	if (!regAge.test(age)) {
		show_vilidate_msg("#emp_update_age", "error", "年龄必须是整数");
		return false;
	} else {
		show_vilidate_msg("#emp_update_age", "success", "");
	}

	// 2.发送ajax请求
	// $.ajax({
	// url:"emp/"+$(this).attr("edit-id"),
	// type:"POST",
	// data:$("#empUpdateModal form").serialize()+"&_method=PUT",
	// success:function(result){
	// alert(result.msg);
	// $("#empUpdateModal").modal('hide');
	// to_page(currentPage);
	// }
	//	
	// })
	$.ajax({
		url : "http://10.10.72.145:8080/ssm/emp/" + $(this).attr("edit-id"),
		type : "PUT",
		data : $("#empUpdateModal form").serialize(),
		success : function(result) {
			alert(result.msg);
			$("#empUpdateModal").modal('hide');
			to_page(currentPage);
		}

	})
})
// =====================员工编辑(结束)===========================

// =====================员工删除(开始)===========================
$(document).on("click", ".delete_btn", function() {
	// 1. 弹出是否删除提醒
	// alert($(this).parents("tr").find("td:eq(1)").text());
	var id = $(this).attr("del-id");
	var lastName = $(this).parents("tr").find("td:eq(2)").text();
	if (confirm("确认删除[" + lastName + "]吗?")) {
		// 确认后发送ajax请求删除
		$.ajax({
			url : "http://10.10.72.145:8080/ssm/emp/" + id,
			type : "DELETE",
			success : function(result) {
				alert(result.msg);
				to_page(currentPage);
			}
		});
	}
})

/**
 * 点击全部选中,或全不选中
 * 
 * @returns
 */
$("#check_all").click(function() {
	// attr checked 时未定义类型
	// attr 用于获取自定义属性
	// prop修改和读取dom原生属性的值
	$(".check_item").prop("checked", $(this).prop("checked"));
})
/**
 * 判断全选框的状态
 * 
 * @returns
 */
$(document).on("click", ".check_item", function() {
	var flag = $(".check_item:checked").length == $(".check_item").length;

	$("#check_all").prop("checked", flag);
});

/**
 * 批量删除
 * @returns
 */
$("#emp_delete_all_btn").click(function() {
	var empNames = "";
	var del_idstr = "";
	$.each($(".check_item:checked"), function() {
		empNames += $(this).parents("tr").find("td:eq(2)").text() + ",";
		del_idstr += $(this).parents("tr").find("td:eq(1)").text() + "-";
	});
	if (empNames == "" || del_idstr == "") {
		return;
	}
	//去除多余字符
	empNames = empNames.substring(0, empNames.length - 1);
	del_idstr = del_idstr.substring(0, del_idstr.length - 1);
	if (confirm("确认删除[" + empNames + "]吗?")) {
		$.ajax({
			url : "http://10.10.72.145:8080/ssm/emp/" + del_idstr,
			type : "DELETE",
			success : function(result) {
				alert(result.msg);
				to_page(currentPage);
			}
		});
	}
});
// =====================员工删除(结束)===========================
