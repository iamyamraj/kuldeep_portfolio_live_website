import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { eyebrowBoneNames, typingBoneNames } from "../../../data/boneData";

const setAnimations = (gltf: GLTF) => {
  let character = gltf.scene;
  let mixer = new THREE.AnimationMixer(character);
  
  let smileAction: THREE.AnimationAction | null = null;
  let eyeBrowUpAction: THREE.AnimationAction | null = null;

  if (gltf.animations) {
    const introClip = gltf.animations.find(
      (clip) => clip.name === "introAnimation"
    );
    if (introClip) {
      const introAction = mixer.clipAction(introClip);
      introAction.setLoop(THREE.LoopOnce, 1);
      introAction.clampWhenFinished = true;
      introAction.play();
    }

    // Base idle animations
    const idleNames = ["key5", "key6"];
    idleNames.forEach((name) => {
      const clip = THREE.AnimationClip.findByName(gltf.animations, name);
      if (clip) {
        const action = mixer?.clipAction(clip);
        action!.play();
        action!.timeScale = 1.2;
      }
    });

    // Potential Smile Animations: testing key1/key2
    const smileClip = gltf.animations.find(c => c.name === "key1" || c.name === "key2");
    if (smileClip) {
       smileAction = mixer.clipAction(smileClip);
       smileAction.setEffectiveWeight(0);
       smileAction.play();
    }

    let typingAction = createBoneAction(gltf, mixer, "typing", typingBoneNames);
    if (typingAction) {
      typingAction.enabled = true;
      typingAction.play();
      typingAction.timeScale = 1.2;
    }
  }

  function startIntro() {
    const introClip = gltf.animations.find(
      (clip) => clip.name === "introAnimation"
    );
    if (introClip) {
      const introAction = mixer.clipAction(introClip);
      introAction.reset().play();
    }

    const blink = gltf.animations.find((clip) => clip.name === "Blink");
    if (blink) {
      const blinkAction = mixer.clipAction(blink);
      blinkAction.setLoop(THREE.LoopOnce, 1);
      blinkAction.clampWhenFinished = false;
      blinkAction.timeScale = 7.71;

      const triggerBlink = () => {
        blinkAction.reset().play();
        const nextBlinkDelay = Math.random() * 3000 + 3000;
        setTimeout(triggerBlink, nextBlinkDelay);
      };
      setTimeout(triggerBlink, 3000);
    }
  }

  function hover(gltf: GLTF, hoverDiv: HTMLDivElement | null) {
    eyeBrowUpAction = createBoneAction(
      gltf,
      mixer,
      "browup",
      eyebrowBoneNames
    );
    let isHovering = false;
    if (eyeBrowUpAction) {
      eyeBrowUpAction.setLoop(THREE.LoopOnce, 1);
      eyeBrowUpAction.clampWhenFinished = true;
      eyeBrowUpAction.enabled = true;
    }
    const onHoverFace = () => {
      if (eyeBrowUpAction && !isHovering) {
        isHovering = true;
        eyeBrowUpAction.reset();
        eyeBrowUpAction.enabled = true;
        eyeBrowUpAction.setEffectiveWeight(5);
        eyeBrowUpAction.fadeIn(0.4).play();
        
        if (smileAction) {
          smileAction.enabled = true;
          smileAction.setEffectiveWeight(1);
          smileAction.fadeIn(0.5);
        }
      }
    };
    const onLeaveFace = () => {
      if (eyeBrowUpAction && isHovering) {
        isHovering = false;
        eyeBrowUpAction.fadeOut(0.5);
        if (smileAction) {
          smileAction.fadeOut(0.5);
        }
      }
    };
    
    if (hoverDiv) {
      hoverDiv.addEventListener("mouseenter", onHoverFace);
      hoverDiv.addEventListener("mouseleave", onLeaveFace);
    }
    
    return {
      onHoverFace,
      onLeaveFace,
      cleanup: () => {
        if (hoverDiv) {
          hoverDiv.removeEventListener("mouseenter", onHoverFace);
          hoverDiv.removeEventListener("mouseleave", onLeaveFace);
        }
      }
    };
  }

  return { mixer, startIntro, hover };
};

const createBoneAction = (
  gltf: GLTF,
  mixer: THREE.AnimationMixer,
  clip: string,
  boneNames: string[]
): THREE.AnimationAction | null => {
  const AnimationClip = THREE.AnimationClip.findByName(gltf.animations, clip);
  if (!AnimationClip) return null;
  const filteredClip = filterAnimationTracks(AnimationClip, boneNames);
  return mixer.clipAction(filteredClip);
};

const filterAnimationTracks = (
  clip: THREE.AnimationClip,
  boneNames: string[]
): THREE.AnimationClip => {
  const filteredTracks = clip.tracks.filter((track) =>
    boneNames.some((boneName) => track.name.includes(boneName))
  );

  return new THREE.AnimationClip(
    clip.name + "_filtered",
    clip.duration,
    filteredTracks
  );
};

export default setAnimations;
