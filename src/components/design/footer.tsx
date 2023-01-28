const Footer = ({ children }: { children?: React.ReactNode }) => (
  <footer className='sticky bottom-0 pb-4'>
    <ul className='mx-4 flex items-center divide-x divide-cb-white rounded-lg bg-cb-dusty-blue text-cb-yellow'>
      {children}
    </ul>
  </footer>
)

export default Footer
