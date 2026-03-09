import styles from './InterpretationBox.module.css'

interface Props {
  text: string
  label?: string
}

export default function InterpretationBox({ text, label = 'Presales 해석' }: Props) {
  return (
    <div className={styles.box}>
      <div className={styles.label}>{label}</div>
      <p className={styles.text}>{text}</p>
    </div>
  )
}
