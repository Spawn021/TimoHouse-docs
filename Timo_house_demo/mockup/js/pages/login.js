(function (TH) {
  const U = TH.ui, I = TH.icon, esc = TH.f.esc;
  TH.pages.login = {
    render(app) {
      app.innerHTML = `<div class="login">
  <section class="login-hero" aria-label="Giới thiệu TimoHouse">
    <div class="login-brand"><img src="assets/logo.svg" alt=""><div><div class="name">Timo<span>House</span></div><div class="tag">Quản lý nhà cho thuê</div></div></div>
    <div class="login-hero-copy"><h2>Giải pháp quản lý<br>nhà cho thuê toàn diện</h2><p>Tối ưu vận hành, tăng hiệu suất và đồng hành<br>cùng bạn trên hành trình phát triển tài sản cho thuê.</p></div>
    <div class="login-features">
      <div class="feat"><div class="ic">${I('bar-chart')}</div><div><b>Quản lý tập trung</b><span>Phòng, khách thuê, hợp đồng, thu chi</span></div></div>
      <div class="feat"><div class="ic">${I('shield-check')}</div><div><b>Vận hành hiệu quả</b><span>Tự động hóa quy trình, giảm thiểu sai sót</span></div></div>
      <div class="feat"><div class="ic">${I('users')}</div><div><b>Báo cáo minh bạch</b><span>Cập nhật số liệu theo thời gian thực</span></div></div>
      <div class="feat"><div class="ic">${I('cloud')}</div><div><b>Truy cập mọi lúc, mọi nơi</b><span>Làm việc linh hoạt trên mọi thiết bị</span></div></div>
    </div>
    <div class="script">Tài sản tốt hơn<br><span>Cuộc sống tốt hơn</span></div><div class="foot">TimoHouse v1.0.0<br>© 2026 TimoHouse. All rights reserved.</div>
  </section>
  <section class="login-side"><button type="button" class="login-lang" aria-label="Chọn ngôn ngữ">${I('globe')}<span>Tiếng Việt</span>${I('chevron-down')}</button>
    <div class="login-card" data-guide="login-card"><h1>Đăng nhập TimoHouse</h1><div class="sub">Chào mừng bạn trở lại! Vui lòng đăng nhập để tiếp tục<br class="login-desktop-break"> quản lý hệ thống nhà cho thuê.</div>
      <div id="login-err" hidden></div>
      <form id="login-form" class="login-form" autocomplete="on">
        ${U.field({ label: 'Email hoặc tên đăng nhập', req: true, input: U.input({ name: 'username', value: 'admin', icon: 'user', placeholder: 'nguyenvanminh', attrs: { autocomplete: 'username', autofocus: true, 'aria-label': 'Email hoặc tên đăng nhập' } }) })}
        ${U.field({ label: 'Mật khẩu', req: true, input: `<div class="inp-wrap">${I('lock')}<input type="password" name="password" value="demo123" placeholder="••••••••••" autocomplete="current-password" aria-label="Mật khẩu"><button type="button" class="btn-icon" data-act="eye" aria-label="Hiện mật khẩu">${I('eye-off')}</button></div>` })}
        <div class="login-options"><label class="chk"><input type="checkbox" name="remember" checked> <span>Ghi nhớ đăng nhập</span></label><span class="login-forgot">Quên mật khẩu? <a class="link" href="#" data-act="forgot">Liên hệ quản trị viên</a></span></div>
        <button type="submit" class="btn btn-primary btn-block login-submit">${I('log-in')}<span>Đăng nhập</span></button>
      </form>
      <div class="divider">hoặc</div>
      ${U.note('info', 'Bảo mật tài khoản', 'Hệ thống được bảo vệ bằng mã hóa SSL. Vui lòng không chia sẻ thông tin đăng nhập cho người khác.', 'shield-check')}
    </div><div class="login-foot">Cần hỗ trợ? Liên hệ quản trị viên hệ thống <b>TimoHouse</b></div></section></div>`;
      const form = app.querySelector('#login-form'), errBox = app.querySelector('#login-err');
      const showErr = (msg) => { errBox.hidden = false; errBox.innerHTML = `<div class="login-alert" role="alert">${I('alert-triangle')}<div><b>Thông tin đăng nhập không chính xác</b><span>${esc(msg)}</span></div><button type="button" class="close-x" data-act="close-err" aria-label="Đóng thông báo lỗi">${I('x')}</button></div>`; };
      form.addEventListener('submit', (e) => { e.preventDefault(); const d = U.formData(form); try { TH.auth.login(d.username, d.password); TH.router.render(); U.toast('ok', 'Đăng nhập thành công', 'Xin chào ' + TH.store.state.session.name); } catch (err) { showErr(err.message); } });
      U.bind(app.querySelector('.login') || form.closest('section') || form, { eye: (b) => { const inp = form.querySelector('input[name=password]'); inp.type = inp.type === 'password' ? 'text' : 'password'; b.innerHTML = I(inp.type === 'password' ? 'eye-off' : 'eye'); b.setAttribute('aria-label', inp.type === 'password' ? 'Hiện mật khẩu' : 'Ẩn mật khẩu'); }, forgot: () => U.toast('info', 'Liên hệ quản trị viên', 'Bản demo: admin / ketoan / vanhanh' + (TH.phase && TH.phase.on(2) ? ' · P2: sale / kythuat' : '') + (TH.phase && TH.phase.on(3) ? ' · P3: nhansu / codong' : '') + ' – mật khẩu bất kỳ'), 'close-err': () => errBox.hidden = true });
    }
  };
})(window.TH);
