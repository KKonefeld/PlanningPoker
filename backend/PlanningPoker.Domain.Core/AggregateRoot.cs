namespace PlanningPoker.Domain.Core
{
    public abstract class AggregateRoot : Entity
    {
        public virtual Guid PublicKey { get; set; }
    }
}
