<?php
    /**
     * @desc 使用hota编辑页面
     * @author laserji
     * @mail jiguang1984@gmail.com
     * @date 2013-11-06
     */

	$include_path="../include/";
	$loadPage="page_edit_hota.html";
	$isLoadData=true;
	require($include_path."config.inc.php");	
	/*正式代码开始*/
	
	if($pageId){
		$query="select * from tbl_page where page_id=$pageId";
		$row=show_row($query);
		if($row["page_edit_user"]!= ""){
	 		//取session的用户变量判断是否是同一个用户
	 		//同一个用户允许修改，否则不允许修改
	 		if ( $row["page_edit_user"]!= $_SESSION['userName']){
				showMsg("此页面正在被【".$row["page_edit_user"]."】编辑");
				die();
	 		}
	 	}else{
			$query="update tbl_page set page_edit_user	= '".$_SESSION['userName']."' where page_id='$pageId'";
			
			if(!update_row($query)){
				showMsg("操作失败");
				exit();
			}
		}
		$parm["action_mode"] = "编辑";
	}
	else
	{
		$parm["action_mode"] = "创建";
	}
	$parm["pageId"] = $pageId;

	//填充select
 	$query="select id,name from tbl_page_sort order by id";
 	show_row($query,"","sortList","sL",0,"",0);	
	
	/*正式代码结束*/
	require($include_path."foot.inc.php");	
?>