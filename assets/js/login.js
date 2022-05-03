$(function() {
    $('#link_reg').on('click', function() {
        $('.login-box').fadeOut().hide()
        $('.reg-box').fadeIn().show()
    })
    $('#link_login').on('click', function() {
        $('.reg-box').fadeOut().hide()
        $('.login-box').fadeIn().show()
    })

    // 从layui中获取form对象
    var form = layui.form
    var layer = layui.layer

    // 通过form.verify函数自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致的规则
        repwd: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败，则return一个提示消息
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    // 去注册

    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() },
            success: function(res) {
                if (res.status !== 0) {
                    $('#form_reg')[0].reset()
                    return layer.msg(res.message)
                } else {}
                layer.msg(res.message)
                    // 模拟人的点击行为
                $('#link_login').click()
            }
        })

    })

    // 去登陆
    $('#form_login').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            // 快速拿到表单数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    $('#form_login')[0].reset()
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                    // 奖登陆成功得到的token字符串，保存到localStorage中
                localStorage.removeItem('token')
                localStorage.setItem('token', res.token)
                    // 跳转到后台主页
                location.href = './index.html'
            }
        })

    })
})