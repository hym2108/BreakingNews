$(function() {
    getUserInfo()

    $('#btnLogout').on('click', function() {
        var layer = layui.layer
        layer.confirm('确定退出登陆?', { icon: 3, title: '提示' }, function(index) {
            //do something
            localStorage.removeItem('token')
            location.href = './login.html'
            layer.close(index);
        });
    })
})

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 请求头配置对象
        // headers: { Authorization: localStorage.getItem('token') || '' },
        success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败！')
                }
                renderAvatar(res.data)
                    // console.log(res.data)
            }
            // complete: function(res) {

        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {

        //         localStorage.removeItem('token')
        //         location.href = './login.html'
        //         console.log(11);
        //     }
        // }
    })
}


// 渲染用户的头像
function renderAvatar(user) {
    // 获取用户的名称
    var name = user.nickname || user.username
        // 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)

    // 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}