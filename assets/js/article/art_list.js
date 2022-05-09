$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义一个查询的参数对象，将来请求数据的时候需要将请求提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认每页显示2条
        cate_id: '', //文章分类的ID
        state: '', //文章的发布状态
    }

    initTable()
    initCate()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败！')
                }
                // 使用模板引擎渲染页面数据
                // console.log(res)
                var strHtml = template('tpl-table', res)
                $('tbody').html(strHtml)
                renderPage(res.total)
            },
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                // console.log(res)
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            },
        })
    }

    // 为筛选表单绑定submit事件
    $('#form_search').on('submit', function (e) {
        e.preventDefault()
        // console.log(e)
        // 获取表单中
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    // 定义渲染分布的方法
    function renderPage(total) {
        // console.log(total)
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                // console.log(first)
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            },
        })
    }

    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '#btn-del', function (e) {
        var id = $(this).attr('data-id')
        // console.log(id)

        var len = $('.btn-delete').length
        console.log(len)
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据，如果没有剩余的数据
                    // 则让页码值-1之后，再重新调用initTable()方法
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                        initTable()
                    }
                },
            })

            layer.close(index)
        })
    })
})
