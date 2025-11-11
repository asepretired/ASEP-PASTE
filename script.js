(function(){
  const input = document.getElementById('paste-input')
  const saveBtn = document.getElementById('save-btn')
  const clearBtn = document.getElementById('clear-btn')
  const result = document.getElementById('result')
  const viewSection = document.getElementById('view-section')
  const createSection = document.getElementById('create-section')
  const pasteOutput = document.getElementById('paste-output')
  const backBtn = document.getElementById('back-btn')
  const copyBtn = document.getElementById('copy-btn')

  function encodeBase64(str){
    try{ return btoa(unescape(encodeURIComponent(str))) }
    catch(e){ return btoa(str) }
  }
  function decodeBase64(str){
    try{ return decodeURIComponent(escape(atob(str))) }
    catch(e){ return atob(str) }
  }

  function makeLinkFromText(text){
    const hash = 'paste=' + encodeBase64(text)
    return location.origin + location.pathname + '#' + hash
  }

  function showResult(link){
    result.innerHTML = 'Link paste: <a href="' + link + '" target="_blank">' + link + '</a>'
  }

  function showPaste(text){
    pasteOutput.textContent = text
    createSection.hidden = true
    viewSection.hidden = false
  }

  saveBtn.addEventListener('click', function(){
    const text = input.value.trim()
    if(!text){ result.textContent = 'Teks kosong'; return }
    const link = makeLinkFromText(text)
    showResult(link)
    navigator.clipboard?.writeText(link).catch(()=>{})
  })

  clearBtn.addEventListener('click', function(){
    input.value = ''
    result.textContent = ''
  })

  backBtn.addEventListener('click', function(){
    createSection.hidden = false
    viewSection.hidden = true
    pasteOutput.textContent = ''
    history.replaceState(null,'',location.pathname)
  })

  copyBtn.addEventListener('click', function(){
    const text = pasteOutput.textContent || ''
    if(!text) return
    navigator.clipboard.writeText(text).then(()=>{ alert('Teks disalin') }, ()=>{ alert('Gagal menyalin') })
  })

  function loadFromHash(){
    const h = location.hash.replace('#','')
    if(!h) return false
    const params = new URLSearchParams(h)
    if(params.has('paste')){
      try{
        const decoded = decodeBase64(params.get('paste'))
        showPaste(decoded)
        return true
      }catch(e){ console.error('decode error', e); return false }
    }
    return false
  }

  loadFromHash()
  window.addEventListener('hashchange', loadFromHash)
})()
