import React from 'react'

const ProcessSteps = () => {
  return (
    <div className='flex w-full bg-[#242424] h-16 mt-20 md:mt-40 mb-20 md:mb-20 relative'>
      {/* Road lines */}
      <div className='border-b h-1 absolute top-2 w-full border-white'></div>
      <div className='w-full border-t-5 top-1/2 border-dashed border-white h-2 absolute inset-0'></div>
      <div className='border-b h-1 absolute bottom-2 w-full border-white'></div>

      {/* Point 1 - Top Left */}
      <div className='flex flex-col items-center'>
        <div className='w-8 h-8 md:w-12 md:h-12 bg-[#3C2415] rounded-full flex justify-center items-center absolute -top-16 md:-top-20 left-1 md:left-36 text-white poppins-bold text-sm md:text-base'>01</div>
        <div className='w-0.5 h-8 md:h-8 bg-black absolute left-[1.2rem] md:left-[10.4rem] -top-8 md:-top-8'></div>
        <div className='absolute -top-16 md:-top-20 left-10 md:left-50 text-xs md:text-sm max-w-[150px] md:max-w-none'>
          <p className='text-sm md:text-md poppins-bold'>Share Your Idea</p>
          <p className='text-[10px] lg:text-[12px] md:text-md poppins-light'>Send us your sketches, photos, or designs.</p>
        </div>
      </div>

      {/* Point 2 - Bottom Center */}
      <div className='flex  flex-col items-center'>
        <div className='w-8 h-8 md:w-12 md:h-12 bg-[#C49A6C] rounded-full flex justify-center items-center absolute -bottom-14 md:-bottom-20 left-[12rem] md:left-[24rem] lg:left-[34rem] -translate-x-1/2 text-white poppins-bold text-sm md:text-base'>02</div>
        <div className='w-0.5 h-6 md:h-8 bg-black absolute left-[12rem] md:left-[24rem] lg:left-[34rem] -translate-x-1/2 -bottom-6 md:-bottom-8'></div>
        <div className='absolute -bottom-18  w-[50%]  left-[13.5rem] md:left-[26rem] lg:left-[36rem] text-xs md:text-sm text-start max-w-[130px] md:max-w-1/3'>
          <p className='text-sm md:text-md poppins-bold'>We Consult</p>
          <p className='text-[10px] lg:text-[12px]  md:text-md poppins-light'>We refine the concept and materials with you.</p>
        </div>
      </div>

      {/* Point 3 - Top Right */}
      <div className='flex flex-col items-center '>
        <div className='w-8 h-8 md:w-12 md:h-12  bg-[#3C2415] rounded-full flex justify-center items-center absolute -top-16 md:-top-20 right-[9.5rem] md:right-[15rem] lg:right-[24.1rem] text-white poppins-bold text-sm md:text-base'>03</div>
        <div className='w-0.5 h-8 md:h-8 bg-black absolute right-[10.5rem] md:right-[16.5rem] lg:right-[25.4rem] -top-8 md:-top-8'></div>
        <div className='absolute -top-[4.5rem] md:-top-20 right-4 md:right-8 lg:right-22 text-xs md:text-sm text-start max-w-[130px] md:max-w-1/4  lg:max-w-none '>
          <p className='text-sm md:text-md poppins-bold'>We Create</p>
          <p className='text-[10px] lg:text-[12px] md:text-md poppins-light'>Our craftspeople build your vision with precision.</p>
        </div>
      </div>
    </div>
  )
}

export default ProcessSteps