import classnames from 'classnames'

export default function Button({
  className,
  onClick,
  type,
  disabled,
  children,
}: {
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit' | 'reset' | undefined
  disabled?: boolean
  children?: React.ReactNode
}) {
  return (
    <button
      type={type ?? 'button'}
      onClick={onClick}
      disabled={disabled ?? false}
      className={classnames(
        'group w-full cursor-pointer rounded-lg border-none bg-cb-dark-blue text-center text-lg',
        className
      )}
    >
      <span className='block translate-y-[-4px] transform rounded-lg bg-[#5a3e84] p-3 text-lg duration-[600ms] ease-[cubic-bezier(.3,.7,.4,1)] hover:ease-[cubic-bezier(.3,.7,.4,1.5)] group-hover:translate-y-[-6px] group-hover:duration-[250ms] group-active:translate-y-[-2px] group-active:duration-[34ms]'>
        {children}
      </span>
    </button>
  )
}
