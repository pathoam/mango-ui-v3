import xw from 'xwind'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid'
import { abbreviateAddress, getSymbolForTokenMintAddress } from '../utils'
import useMarketList from '../hooks/useMarketList'
import { nativeToUi } from '@blockworks-foundation/mango-client/lib/utils'
import useMangoStore from '../stores/useMangoStore'
import { tokenPrecision } from '../utils/index'

const AccountSelect = ({
  accounts,
  selectedAccount,
  onSelectAccount,
  hideBalance = false,
}) => {
  const { getTokenIndex } = useMarketList()
  const mintDecimals = useMangoStore((s) => s.selectedMangoGroup.mintDecimals)
  const handleChange = (value) => {
    const newAccount = accounts.find((a) => a.publicKey.toString() === value)
    onSelectAccount(newAccount)
  }

  const getBalanceForAccount = (account) => {
    const mintAddress = account?.account.mint.toString()
    const balance = nativeToUi(
      account?.account?.amount,
      mintDecimals[getTokenIndex(mintAddress)]
    )
    const symbol = getSymbolForTokenMintAddress(mintAddress)

    return balance.toFixed(tokenPrecision[symbol])
  }

  return (
    <div css={xw`relative inline-block w-full`}>
      <Listbox
        value={selectedAccount?.publicKey.toString()}
        onChange={handleChange}
      >
        {({ open }) => (
          <>
            <Listbox.Button
              css={xw`border border-mango-dark-lighter focus:outline-none focus:ring-1 focus:ring-mango-yellow p-2 w-full`}
            >
              <div
                css={xw`flex items-center text-base justify-between font-light`}
              >
                <div css={xw`flex items-center flex-grow`}>
                  <img
                    alt=""
                    width="20"
                    height="20"
                    src={`/assets/icons/${getSymbolForTokenMintAddress(
                      selectedAccount?.account?.mint.toString()
                    ).toLowerCase()}.svg`}
                    css={xw`mr-4`}
                  />
                  {abbreviateAddress(selectedAccount?.publicKey)}
                  {!hideBalance ? (
                    <div css={xw`ml-4 text-sm text-right flex-grow`}>
                      ({getBalanceForAccount(selectedAccount)})
                    </div>
                  ) : null}
                </div>
                {open ? (
                  <ChevronUpIcon css={xw`h-5 w-5 ml-2`} />
                ) : (
                  <ChevronDownIcon css={xw`h-5 w-5 ml-2`} />
                )}
              </div>
            </Listbox.Button>
            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Listbox.Options
                static
                css={xw`z-20 p-1 absolute left-0 w-full mt-1 bg-mango-dark-light origin-top-left divide-y divide-mango-dark-lighter shadow-lg outline-none border border-mango-dark-lighter`}
              >
                <div css={xw`opacity-50 p-2`}>
                  Your Connected Wallet Token Accounts
                </div>
                {accounts.map((account) => {
                  const symbolForAccount = getSymbolForTokenMintAddress(
                    account?.account?.mint.toString()
                  )

                  return (
                    <Listbox.Option
                      key={account?.publicKey.toString()}
                      value={account?.publicKey.toString()}
                    >
                      {({ selected }) => (
                        <div
                          css={[
                            xw`p-2 text-sm hover:bg-mango-dark-lighter hover:cursor-pointer tracking-wider font-light`,
                            selected &&
                              xw`text-mango-yellow bg-mango-dark-lighter`,
                          ]}
                        >
                          <div css={xw`flex items-center space-x-2`}>
                            <img
                              alt=""
                              width="20"
                              height="20"
                              src={`/assets/icons/${symbolForAccount.toLowerCase()}.svg`}
                            />
                            <div css={xw`flex-grow text-left`}>
                              {abbreviateAddress(account?.publicKey)}
                            </div>
                            <div css={xw`text-sm`}>
                              {!hideBalance
                                ? getBalanceForAccount(account)
                                : null}{' '}
                              ({symbolForAccount})
                            </div>
                          </div>
                        </div>
                      )}
                    </Listbox.Option>
                  )
                })}
              </Listbox.Options>
            </Transition>
          </>
        )}
      </Listbox>
    </div>
  )
}

export default AccountSelect