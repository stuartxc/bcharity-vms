import { SearchIcon } from '@heroicons/react/outline'
import { useMemo, useState } from 'react'

import { ClearFilters } from '@/components/Shared'
import { Card, ErrorMessage, Spinner } from '@/components/UI'
import { useVolunteers } from '@/lib/lens-protocol'
import { useAppPersistStore } from '@/store/app'

import { DashboardDropDown } from '../../VolunteerDashboard'
import PurpleBox from './PurpleBox'
import VolunteerDataCard from './VolunteerDataCard'

interface IAllVolunteersTabProps {
  hidden: boolean
}

const AllVolunteersTab: React.FC<IAllVolunteersTabProps> = ({ hidden }) => {
  const { currentUser: profile } = useAppPersistStore()

  const { loading, data, error, refetch } = useVolunteers({ profile })

  const [selectedId, setSelectedId] = useState<string>('')

  const selectedValue = useMemo(() => {
    return data.find((val) => val.profile.id === selectedId) ?? null
  }, [data, selectedId])

  const [searchValue, setSearchValue] = useState('')
  const [categories] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  return (
    <div className={`${hidden ? 'hidden' : ''} flex space-x-24 pt-5`}>
      <div className="grow w-0">
        <h1 className="text-3xl font-bold pb-3">All volunteers</h1>
        <div className="flex items-center">
          <div className="flex justify-between h-[50px] bg-accent-content items-center rounded-md border-violet-300 border-2 dark:bg-Input">
            <input
              className="focus:ring-0 border-none outline-none focus:border-none focus:outline-none bg-transparent rounded-2xl"
              type="text"
              value={searchValue}
              placeholder={'search'}
              onChange={(e) => {
                setSearchValue(e.target.value)
              }}
            />
            <div className="h-5 w-5 mr-5">
              <SearchIcon />
            </div>
          </div>

          <div className="flex items-center">
            <div className="h-[50px] z-10 ">
              <DashboardDropDown
                label={'filter'}
                options={Array.from(categories)}
                onClick={(c) => setSelectedCategory(c)}
                selected={selectedCategory}
              ></DashboardDropDown>
            </div>
            <ClearFilters
              onClick={() => {
                setSelectedCategory('')
              }}
            />
          </div>
        </div>

        <Card>
          {error && <ErrorMessage error={new Error(error)} />}
          <div className="scrollbar">
            {loading ? (
              <Spinner />
            ) : (
              <>
                {data.map((item) => {
                  return (
                    <PurpleBox
                      key={item.profile.id}
                      selected={selectedId === item.profile.id}
                      userName={item.profile.name ?? item.profile.handle}
                      dateCreated={item.dateJoined}
                      onClick={() => {
                        setSelectedId(
                          selectedId === item.profile.id ? '' : item.profile.id
                        )
                      }}
                    />
                  )
                })}
              </>
            )}

            {/* the box placeholder for the data ^ */}
          </div>
        </Card>
      </div>
      <div className="grow w-0">
        {selectedId !== '' && !!selectedValue && (
          <div className="pb-10">
            <VolunteerDataCard vol={selectedValue} />
          </div>
        )}
      </div>
    </div>
  )
}

export default AllVolunteersTab