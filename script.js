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

const daysLeftElement = document.querySelector("#daysLeft");
if (daysLeftElement) {
  const weddingDate = new Date(2026, 5, 7);
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfWedding = new Date(
    weddingDate.getFullYear(),
    weddingDate.getMonth(),
    weddingDate.getDate()
  );
  const diffDays = Math.ceil((startOfWedding - startOfToday) / (1000 * 60 * 60 * 24));
  daysLeftElement.textContent = diffDays >= 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
}

const bgm = document.querySelector("#bgm");
const musicToggle = document.querySelector("#musicToggle");
if (bgm && musicToggle) {
  const setMusicState = (isPlaying) => {
    musicToggle.classList.toggle("is-playing", isPlaying);
    musicToggle.setAttribute("aria-pressed", String(isPlaying));
    musicToggle.textContent = isPlaying ? "BGM ON" : "BGM";
  };

  setMusicState(false);

  const warmupPlay = async () => {
    try {
      bgm.muted = true;
      await bgm.play();
    } catch (error) {
      console.warn("BGM warmup failed", error);
    }
  };

  const enableSound = async () => {
    try {
      if (bgm.paused) {
        await bgm.play();
      }
      bgm.muted = false;
      setMusicState(true);
    } catch (error) {
      console.warn("BGM play failed", error);
      musicToggle.textContent = "재생 불가";
      setTimeout(() => {
        setMusicState(false);
      }, 2000);
    }
  };

  const disableSound = () => {
    bgm.pause();
    setMusicState(false);
  };

  window.addEventListener("load", () => {
    warmupPlay();
  });

  musicToggle.addEventListener("click", async () => {
    try {
      if (bgm.paused || bgm.muted) {
        await enableSound();
      } else {
        disableSound();
      }
    } catch (error) {
      console.warn("BGM play failed", error);
      musicToggle.textContent = "재생 불가";
      setTimeout(() => {
        setMusicState(false);
      }, 2000);
    }
  });

  const handleFirstInteraction = () => {
    enableSound();
  };

  window.addEventListener("pointerdown", handleFirstInteraction, { once: true });
  window.addEventListener("touchstart", handleFirstInteraction, { once: true });
}

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
          shareButton.textContent = "청첩장 공유하기";
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

const isPhoneDevice = /iPhone|Android/i.test(navigator.userAgent);

const wireContactButtons = (attribute, scheme) => {
  document.querySelectorAll(`[${attribute}]`).forEach((button) => {
    const value = button.getAttribute(attribute);
    if (!value) {
      button.disabled = true;
      return;
    }

    button.addEventListener("click", () => {
      if (scheme === "tel" && !isPhoneDevice) {
        alert("통화 연결은 휴대폰에서 가능합니다.");
        return;
      }
      window.location.href = `${scheme}:${value}`;
    });
  });
};

wireContactButtons("data-tel", "tel");
wireContactButtons("data-sms", "sms");

const contactButton = document.querySelector("#contactButton");
if (contactButton) {
  const contactNumbers = Array.from(document.querySelectorAll("[data-tel]"))
    .map((button) => button.getAttribute("data-tel"))
    .filter(Boolean);

  contactButton.addEventListener("click", () => {
    if (!contactNumbers.length) {
      contactButton.textContent = "연락처를 설정해주세요";
      setTimeout(() => {
        contactButton.textContent = "혼주에게 연락하기";
      }, 2000);
      return;
    }

    if (!isPhoneDevice) {
      alert("통화 연결은 휴대폰에서 가능합니다.");
      return;
    }

    window.location.href = `tel:${contactNumbers[0]}`;
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
