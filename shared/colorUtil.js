import * as THREE from 'three'

export const randomColor = () => {
  const r = Math.random(),
    g = Math.random(),
    b = Math.random()
  return new THREE.Color(r, g, b)
}
