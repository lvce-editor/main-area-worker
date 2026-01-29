const getActiveGroup = (groups: any, activeGroupId: any): any => {
  return groups.find((g: any) => g.id === activeGroupId)
}

export { getActiveGroup as GetActiveGroup }
