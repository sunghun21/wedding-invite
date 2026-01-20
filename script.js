const revealTargets = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

revealTargets.forEach((target) => observer.observe(target));

window.addEventListener("load", () => {
  document.body.classList.add("is-ready");
});

const shareButton = document.querySelector("#shareButton");
if (shareButton) {
  shareButton.addEventListener("click", async () => {
    const shareData = {
      title: document.title,
      text: "우성훈 ♥ 서지민의 결혼식에 초대합니다.",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        shareButton.textContent = "링크가 복사되었습니다";
        setTimeout(() => {
          shareButton.textContent = "모바일 청첩장 공유하기";
        }, 2000);
      }
    } catch (error) {
      console.warn("Share failed", error);
    }
  });
}

const rsvpButton = document.querySelector("#rsvpButton");
if (rsvpButton) {
  rsvpButton.addEventListener("click", () => {
    const rsvpConfig = {
      url: "",
      phone: "",
    };

    if (rsvpConfig.url) {
      window.location.href = rsvpConfig.url;
      return;
    }

    if (rsvpConfig.phone) {
      const message = encodeURIComponent("[우성훈 ♥ 서지민 결혼식] 참석 여부를 알려주세요.");
      window.location.href = `sms:${rsvpConfig.phone}?body=${message}`;
      return;
    }

    rsvpButton.textContent = "RSVP 링크를 설정해주세요";
    setTimeout(() => {
      rsvpButton.textContent = "참석 여부 보내기";
    }, 2000);
  });
}

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const text = button.getAttribute("data-copy");
    if (!text) return;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        button.textContent = "복사 완료";
        setTimeout(() => {
          button.textContent = "계좌번호 복사";
        }, 2000);
      }
    } catch (error) {
      console.warn("Copy failed", error);
    }
  });
});
