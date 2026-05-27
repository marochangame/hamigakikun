document.getElementById('startBtn').addEventListener('click',()=>{
  document.querySelectorAll('.germs span').forEach((g,i)=>{
    setTimeout(()=>{
      g.style.opacity='0';
    },i*1000);
  });
});
