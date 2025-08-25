import HotelGallerySlider from '@/components/portfolio/hotel-gallery-slider'
import Link from 'next/link'

const Portfolio = () => {
  return (
    <>
    <div className='flex flex-col mt-5'>
        <div className='flex flex-col px-3 md:flex-row w-full  lg:w-[80%] mx-auto  items-center justify-between'>
            <h1 className='text-3xl md:text-5xl helvetica-bold w-full md:w-[80%] lg:w-[35%] '>In The <span className='text-[#C49A6C]'> Finest</span> Venues.</h1>
            <div className='flex flex-col gap-3'>
                <h2 className='poppins-light'>We are proud partners in creating Australia's most memorable spaces.</h2>
                <Link href='/contact'>
                <button className='hidden md:block text-xs w-fit poppins-semi px-6 py-4 bg-[#3C2415] text-white rounded-full cursor-pointer'>
                    Contact Us
                </button>
               </Link>
            </div>
        </div>
        <HotelGallerySlider/>

    </div>
    </>
  )
}

export default Portfolio