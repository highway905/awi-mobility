import React from "react"

export const AuthHero: React.FC = () => {
  return (
    <div className="hidden sm:flex md:w-1/2 relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/assets/hero.png')`,
        }}
        role="img"
        aria-label="Advanced Warehouse hero image"
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center p-12 text-white w-full text-center">
        <div className="flex items-center mb-8" role="banner">
          <svg
            width="94"
            height="66"
            viewBox="0 0 74 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-4"
            aria-hidden="true"
          >
            <path
              d="M35.7157 55.4458L0 49.3753V13.8063L35.7157 1.66449V55.4458Z"
              fill="#FBBF24"
            />
            <path
              d="M2.05981 47.8717L35.7157 53.5917V2.62272L2.05981 14.0642V47.8717ZM36.7456 55.9995C36.6921 55.9995 36.6385 55.9951 36.5849 55.9862L0.869238 49.9157C0.368705 49.8299 0 49.3662 0 48.8198V13.2507C0 12.7671 0.291119 12.3389 0.719559 12.1926L36.4352 0.0515018C36.7483 -0.0549855 37.0896 0.00565356 37.3546 0.214931C37.6196 0.423469 37.7755 0.756241 37.7755 1.10972V54.8903C37.7755 55.2149 37.6437 55.5233 37.415 55.7333C37.2269 55.9064 36.9893 55.9995 36.7456 55.9995Z"
              fill="#393536"
            />
            <path
              d="M72.461 48.8195L36.7454 54.8901V1.10876L72.461 13.2506V48.8195Z"
              fill="#D48519"
            />
            <path
              d="M37.7754 2.62322V53.5922L71.4312 47.8722V14.0639L37.7754 2.62322ZM36.7455 56C36.5018 56 36.2642 55.9068 36.076 55.7338C35.8474 55.523 35.7155 55.2147 35.7155 54.8907V1.10947C35.7155 0.755992 35.8714 0.423959 36.1365 0.214682C36.4008 0.00614414 36.7427 -0.0537559 37.0558 0.0519919L72.7715 12.193C73.2 12.3387 73.4911 12.7676 73.4911 13.2512V48.8203C73.4911 49.366 73.1223 49.8304 72.6218 49.9154L36.9061 55.986C36.8526 55.9956 36.799 56 36.7455 56Z"
              fill="#393536"
            />
            <path
              d="M12.5504 18.3917L23.1989 15.765V29.1432L12.5504 30.2073V18.3917Z"
              fill="#393536"
            />
            <path
              d="M12.5504 34.3387L23.1989 33.622V52.6626L12.5504 50.6149V34.3387Z"
              fill="#393536"
            />
            <path
              d="M47.4433 4.65265V41.3205L52.8352 40.4908V6.84969L47.4433 4.65265Z"
              fill="#393536"
            />
            <path
              d="M61.2253 9.11353V39.7013L65.2969 39.3041V10.8158L61.2253 9.11353Z"
              fill="#393536"
            />
          </svg>
          <div className="flex flex-col gap-2">
            <div className="text-xl font-medium tracking-small text-[#FBCB5C]">ADVANCED</div>
            <div className="text-xl font-medium tracking-small">WAREHOUSE</div>
          </div>
        </div>

        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-bold mb-2 leading-tight">Empowering Excellence</h1>
          <p className="text-sm text-gray-200 leading-relaxed">
            Secure access to real-time warehouse operations - anytime, anywhere, on the go.
          </p>
        </div>
      </div>
    </div>
  )
}
