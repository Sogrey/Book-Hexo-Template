var searchFunc = function (path, search_id, content_id) {
    'use strict'; //使用严格模式

    const xhr = new XMLHttpRequest();

    xhr.open('GET', path);

    // set response format
    xhr.responseType = 'json';

    xhr.send();

    xhr.onload = () => {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                const datas = xhr.response;
                console.log(datas);

                //ID选择器
                var $input = document.getElementById(search_id);
                var $resultContent = document.getElementById(content_id);
                $input.addEventListener('input', function () {
                    var str = '<ul class=\"search-result-list\">';
                    var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
                    $resultContent.innerHTML = "";
                    if (this.value.trim().length <= 0) {
                        return;
                    }
                    // 本地搜索主要部分
                    datas.forEach(function (data) {
                        var isMatch = true;
                        var content_index = [];
                        var data_title = data.title.trim().toLowerCase();
                        var data_content = data.content.trim().replace(/<[^>]+>/g, "").toLowerCase();
                        var data_url = data.url;
                        var index_title = -1;
                        var index_content = -1;
                        var first_occur = -1;
                        // 只匹配非空文章
                        if (data_title != '' && data_content != '') {
                            keywords.forEach(function (keyword, i) {
                                index_title = data_title.indexOf(keyword);
                                index_content = data_content.indexOf(keyword);
                                if (index_title < 0 && index_content < 0) {
                                    isMatch = false;
                                } else {
                                    if (index_content < 0) {
                                        index_content = 0;
                                    }
                                    if (i == 0) {
                                        first_occur = index_content;
                                    }
                                }
                            });
                        }
                        // 返回搜索结果
                        if (isMatch) {
                            //结果标签
                            str += "<li><a href='" + data_url + "' class='search-result-title' target='_blank'>" + "> " + data_title + "</a>";
                            var content = data.content.trim().replace(/<[^>]+>/g, "");
                            if (first_occur >= 0) {
                                // 拿出含有搜索字的部分
                                var start = first_occur - 6;
                                var end = first_occur + 6;
                                if (start < 0) {
                                    start = 0;
                                }
                                if (start == 0) {
                                    end = 10;
                                }
                                if (end > content.length) {
                                    end = content.length;
                                }
                                var match_content = content.substr(start, end);
                                var reg=/<[^<>]+>/g;
                                match_content=match_content.replace(reg,'');
                                // 列出搜索关键字，定义class加高亮
                                keywords.forEach(function (keyword) {
                                    var regS = new RegExp(keyword, "gi");
                                    match_content = match_content.replace(regS, "<em class=\"search-keyword\">" + keyword + "</em>");
                                })                                
                                str += "<p class=\"search-result\">" + match_content + "...</p>"
                            }
                        }
                    })
                    $resultContent.innerHTML = str;
                })
            } else {
                alert("status = " + xhr.status);
            }
        }
    }
};
var path = "../Book-Hexo-Template/search.json";
searchFunc(path, 'local-search-input', 'local-search-result');
